// const io = require('socket.io-client');

let startHandler;
let actionHandler;
let listUsersHandler;

const startRoom = (e, socket, user, room) => {
  document.querySelector('#btnAction').disabled = false;
  socket.emit('start', { roomname: room });
  socket.emit('listUsers', { name: user, roomname: room });
};

const sendAction = (e, socket, user, room, action) => {
  let target = document.querySelector('#target').value;
    if (action.value === 'confess' || action.value === 'absolve') {  // Make sure that for certain actions user can only target themselves
      target = user;
    }
    socket.emit('action', { name: user, roomname: room, target: target, action: action.value });
};

const listUsers = (e, socket, user, room) => {
  socket.emit('listUsers', { name: user, roomname: room });
};

const connectSocket = (e) => {
  const socket = io.connect();
  
  const user = document.querySelector('#user').value;
  const room = document.querySelector('#room').value;

  const log = document.querySelector('#log');
  const action = document.querySelector('#action');

  log.innerHTML = '';

  socket.on('connect', () => {
    socket.emit('join', { name: user, roomname: room });
  });

  socket.on('win', () => {
    // Display win message
    log.innerHTML += "You have won!\n";
  });

  socket.on('loss', () => {
    // Display loss message
    log.innerHTML += "You have been branded guilty!\n";
  });

  socket.on('notification', (data) => {
    // Display notifications from server
    log.innerHTML += data.msg + '\n';
  });

  socket.on('confirm', (data) => {
    console.log('Server says action confirmed: ' + data.confirm);
    // Disable turn controls
    if (data.confirm) {
      document.querySelector('#btnAction').disabled = false;
    }
  });

  socket.on('turnCount', (data) => {
    // Allow new action
    log.innerHTML += `It is now turn ${data.turnNum}\n`;
    document.querySelector('#btnAction').disabled = false;
    socket.emit('listUsers', { name: user, roomname: room });
  });

  socket.on('acquittalCount', (data) => {
    // Display current acquittal count
  });

  socket.on('persuasionCount', (data) => {

  });

  socket.on('playerList', (data) => {
    // List current game players

    // Probably a more efficient way of doing this. . .
    const target = document.querySelector('#target');
    for (let i = 0; i < target.length; i++) {
      target.remove(i); // Remove old user list
    }

    for (let j = 0; j < data.list.length; j++) {
      const opt = document.createElement("option");
      opt.text = data.list[j];
      target.add(opt);
    }
  });

  socket.on('gameStarted', () => {
    // Enable turn controls
  });

  startHandler = () => startRoom(e, socket, user, room);
  const start = document.querySelector('#btnStart');
  start.addEventListener('click', startHandler);
  start.disabled = false;

  actionHandler = () => sendAction(e, socket, user, room, action);
  document.querySelector('#btnAction').addEventListener('click', actionHandler);

  listUsersHandler = () => listUsers(e, socket, user, room);
};

module.exports.connectSocket = connectSocket;
