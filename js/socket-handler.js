let startHandler;
let actionHandler;
let listUsersHandler;

let user, room; // Ugly, but


//  --  --  --  Misc methods  --  --  --

const displayRoomInfo = (e) => {
  const joinGameDialogue = document.querySelector('#joinGameWrapper');
  joinGameDialogue.display = "block";
};

//  --  --  --  onReceive methods --  --  --

const onRoomCreated = (data) => {
  const createRoomDialogue = document.querySelector('#createRoomWrapper');
  createRoomDialogue.style.display = "none";
};

const onJoined = (data) => {
  const joinDialogue = document.querySelector('#joinGameWrapper');
  joinDialogue.style.display = "none";
  document.querySelector('#btnAction').disabled = false;
  socket.emit('list-users', { name: user, roomname: room });
};

const onConfirm = (data) => {
  // console.log('Server says action confirmed: ' + data.confirm);
  // Disable turn controls
  if (data.confirm) {
    document.querySelector('#btnAction').disabled = true;
  }
};

const onTurnCount = (data) => {
  // Allow new action
  log.innerHTML += `It is now turn ${data.turnNum}\n`;
  document.querySelector('#btnAction').disabled = false;
  socket.emit('list-users', { name: user, roomname: room });
};

const onStats = (data) => {
  // Display current acquittal count & user info
  const guilt = document.querySelector('#guilt');
  const innocence = document.querySelector('#innocence');
  const status = document.querySelector('#status');
  const acquittal = document.querySelector('#acquittal');
  const persuation = document.querySelector('#persuasion');

  guilt.innerHTML = `${data.guilt}/${data.maxGuilt}`;
  innocence.innerHTML = `${data.innocence}`
  status.innerHTML = `${data.status}`
  acquittal.innerHTML = `${data.acquittal}`
  persuasion.innerHTML = `${data.persuasion}`
};

const onRoomList = (data) => {
  // List current game rooms
  const roomList = document.querySelector('#roomList');
  
  while (roomList.firstChild) {
    roomList.removeChild(roomList.firstChild);
  }

  data.rooms.forEach((_room) => {
    const listItem = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.addEventListener('click', displayRoomInfo);
    anchor.innerHTML = _room;
    anchor.className = 'roomAnchor';
    listItem.className = 'roomListItem';
    listItem.appendChild(anchor);
    roomList.appendChild(listItem);
  });
};

const onPlayerList = (data) => {
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
};

//  --  --  --  Send methods  --  --  --

const createRoom = (socket, room) => {
  const newRoom = document.querySelector('#roomname').value;

  document.querySelector('#btnCreate').disabled = true;
  socket.emit('create-room', { roomname: newRoom});
};

const joinRoom = (e, socket) => {
  const roomname = document.querySelector('#room').value;
  const username = document.querySelector('#user').value;

  if (roomname && username) {
    room = roomname;
    user = username;

    socket.emit('join', { roomname: room });
  }

  e.preventDefault();
  e.stopPropagation();

  return false;
};

const startGame = (socket) => {
  document.querySelector('#btnAction').disabled = false;
  socket.emit('start', { roomname: room });
  socket.emit('list-users', { name: user, roomname: room });
};

const sendAction = (e, socket, action) => {
  let target = document.querySelector('#target').value;
    if (action.value === 'confess' || action.value === 'absolve') {  // Make sure that for certain actions user can only target themselves
      target = user;
    }
    socket.emit('action', { name: user, roomname: room, target: target, action: action.value });
};

const listUsers = (socket) => {
  socket.emit('list-users', { name: user, roomname: room });
};

const connectSocket = (e) => {
  const socket = io.connect();
  
  const log = document.querySelector('#log');
  const action = document.querySelector('#action');

  log.innerHTML = '';

  socket.on('connect', () => {
    // socket.emit('join', { name: user, roomname: room });
  });

  socket.on('branded', () => {
    // Display loss message
    log.innerHTML += "You have been branded guilty! Your actions will be ignored by the game from here on.\n";
  });

  socket.on('notification', (data) => {
    // Display notifications from server
    log.innerHTML += data.msg + '\n';
  });

  socket.on('room-created', onRoomCreated);
  socket.on('joined', onJoined);
  socket.on('confirm', onConfirm);
  socket.on('turn-count', onTurnCount);
  socket.on('stats', onStats);
  socket.on('room-list', onRoomList);
  socket.on('player-list', onPlayerList);

  socket.on('results', (data) => {

  });

  startHandler = (e) => startGame(e, socket);
  const start = document.querySelector('#btnStart');
  start.addEventListener('click', startHandler);
  start.disabled = false;

  joinHandler = (e) => joinRoom(e, socket);
  const join = document.querySelector('#btnJoin');
  join.addEventListener('submit', joinHandler);

  actionHandler = (e) => sendAction(e, socket, action);
  document.querySelector('#btnAction').addEventListener('click', actionHandler);

  listUsersHandler = (e) => listUsers(e, socket);
};

module.exports.connectSocket = connectSocket;
