const io = require('socket.io-client');

let startHandler;
let actionHandler;
let listUsersHandler;

const startRoom = (e, socket, user, room) => {
  socket.emit('start', { roomname: room });
};

const sendAction = (e, socket, user, room, action) => {
  let target = document.querySelector('#target').value;
    if (action === 'confess' || action === 'absolve') {  // Make sure that for certain actions user can only target themselves
      target = user;
    }
    socket.emit('action', { name: user, roomname: room, target: target, action: action });
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

  socket.on('connect', () => {
    socket.emit('join', { name: user, roomname: room });
  });

  socket.on('win', () => {
    // Display win message
    log.innerHTML += "You have won!";
  });

  socket.on('loss', () => {
    // Display loss message
    log.innerHTML += "You have been branded guilty!";
  });

  socket.on('notification', (data) => {
    // Display notifications from server
    log.innerHTML += data.msg;
  });

  socket.on('confirm', (data) => {
    // Disable turn controls
    if (data.confirm) {
      action.disabled = true;
    }
  });

  socket.on('turnCount', (data) => {
    // Allow new action
    log.innerHTML += `It is now turn ${data.turnNum}`;
    action.disabled = false;
  });

  socket.on('playerList', () => {
    // List current game players
  });

  socket.on('gameStarted', () => {
    // Enable turn controls
  });

  startHandler = () => startRoom(e, socket, user, room);
  document.querySelector('#btnStart').addEventListener('click', startHandler);

  actionHandler = () => sendAction(e, socket, user, room, action.value);
  document.querySelector('#btnAction').addEventListener('click', actionHandler);

  listUsersHandler = () => listUsers(e, socket, user, room);
};

module.exports.connectSocket = connectSocket;
