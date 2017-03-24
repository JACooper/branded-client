let startHandler;
let actionHandler;
let listUsersHandler;

let user, room; // Ugly, but


//  --  --  --  Misc methods  --  --  --

const displayRoomInfo = (e) => {
  const joinGameDialogue = document.querySelector('#joinGameWrapper');
  joinGameDialogue.style.display = "block";

  const joinRoomname = document.querySelector('#room');
  joinRoomname.value = e.target.innerHTML;

  document.querySelector('#user').focus();
};

//  --  --  --  onReceive methods --  --  --

const onRoomCreated = (data) => {
  const createRoomDialogue = document.querySelector('#createRoomWrapper');
  createRoomDialogue.style.display = "none";
  document.querySelector('#roomname').value = '';
};

const onJoined = (socket, data) => {
  const joinDialogue = document.querySelector('#joinGameWrapper');
  joinDialogue.style.display = "none";
  if (data.joined) {
    document.querySelector('#btnAction').disabled = false;
    socket.emit('list-users', { name: user, roomname: room });
  } else {
    const log = document.querySelector('#log');
    log.innerHTML += "Could not join room.\n";
  }
};

const onConfirm = (data) => {
  // console.log('Server says action confirmed: ' + data.confirm);
  // Disable turn controls
  if (data.confirm) {
    document.querySelector('#btnAction').disabled = true;
  } else {
    const log = document.querySelector('#log');
    log.innerHTML += "Invalid action!\n";
  }
};

const onTurnCount = (socket, data) => {
  // Allow new action
  document.querySelector('#btnAction').disabled = false;
  document.querySelector('#btnStart').disabled = true;

  log.innerHTML += `It is now turn ${data.turnNum}\n`;
  socket.emit('list-users', { name: user, roomname: room });
};

const onStats = (data) => {
  // Display current acquittal count & user info
  const guilt = document.querySelector('#guilt');
  const innocence = document.querySelector('#innocence');
  const status = document.querySelector('#status');
  const acquittal = document.querySelector('#acquittal');
  const persuation = document.querySelector('#persuasion');

  guilt.value = `${data.guilt}/${data.maxGuilt}`;
  innocence.value = `${data.innocence}`
  status.value = `${data.status}`
  acquittal.value = `${data.acquittal}`
  persuasion.value = `${data.persuasion}`
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
    anchor.innerHTML = _room.roomname;
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
  for (let i = target.length - 1; i >= 0; i--) {
    target.remove(i); // Remove old user list
  }

  for (let j = 0; j < data.list.length; j++) {
    const opt = document.createElement("option");
    opt.text = data.list[j];
    target.add(opt);
  }
};

const onResults = (data) => {
  const users = data.users;
  users.forEach((_user) => {
    let state = "won";
    if (_user.lost) {
      state = "lost";
    }

    log.innerHTML += `${_user.name}, who was a ${_user.role}, ${state}`;
  });
};

//  --  --  --  Send methods  --  --  --

const createRoom = (socket) => {
  const newRoom = document.querySelector('#roomname').value;

  document.querySelector('#btnCreate').disabled = true;
  socket.emit('create-room', { roomname: newRoom});
};

const joinRoom = (e, socket) => {
  const roomname = document.querySelector('#room').value;
  const username = document.querySelector('#user').value;

  if (roomname !== '' && username !== '') {
    room = roomname;
    user = username;

    socket.emit('join', { roomname: room, name: user });
  }

  e.preventDefault();
  e.stopPropagation();

  return false;
};

const startGame = (e, socket) => {
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
  socket.on('joined', (data) => { onJoined(socket, data); });
  socket.on('confirm', onConfirm);
  socket.on('turn-count', (data) => { onTurnCount(socket, data); });
  socket.on('stats', onStats);
  socket.on('room-list', onRoomList);
  socket.on('player-list', onPlayerList);
  socket.on('results', onResults);

  startHandler = (e) => startGame(e, socket);
  const start = document.querySelector('#btnStart');
  start.addEventListener('click', startHandler);
  start.disabled = false;

  joinHandler = (e) => joinRoom(e, socket);
  const join = document.querySelector('#btnJoin');
  join.addEventListener('click', joinHandler);

  actionHandler = (e) => sendAction(e, socket, action);
  document.querySelector('#btnAction').addEventListener('click', actionHandler);

  listUsersHandler = (e) => listUsers(e, socket);

  document.querySelector('#btnCreate').addEventListener('click', (e) => {
    createRoom(socket);
  });
};

module.exports.connectSocket = connectSocket;
