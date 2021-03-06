const socketHandler = require('./socket-handler.js');

const toggleTarget = (e) => {
  const action = document.querySelector('#action');
  const target = document.querySelector('#target');
  if (action.value === 'absolve' || action.value === 'confess') {
    target.disabled = true;
  } else {
    target.disabled = false;
  }
};

const allowCreation = (e) => {
  const roomname = document.querySelector('#roomname').value;
  const buttonCreate = document.querySelector('#btnCreate');

  if (roomname !== '') {
    buttonCreate.disabled = false;
  } else {
    buttonCreate.disabled = true;
  }
};

const allowJoin = (e) => {
  const username = document.querySelector('#user').value;
  const buttonJoin = document.querySelector('#btnJoin');
  
  if (username !== '') {
    buttonJoin.disabled = false;
  } else {
    buttonJoin.disabled = true;
  }
};

const showCreateScreen = (e) => {
  const createRoomDialogue = document.querySelector('#createRoomWrapper');
  createRoomDialogue.style.display = "block";

  document.querySelector('#roomname').focus();
};

const showRules = (e) => {
  const rulesDiv = document.querySelector('#rulesWrapper');
  rulesDiv.style.display = "block";
};

const closeRules = (e) => {
  const rulesDiv = document.querySelector('#rulesWrapper');
  rulesDiv.style.display = "none";
};

const init = () => {
  socketHandler.connectSocket();

  const createRoomName = document.querySelector('#roomname');
  createRoomName.addEventListener('change', allowCreation);

  const joinUserName = document.querySelector('#user');
  joinUserName.addEventListener('change', allowJoin);

  const createRoom = document.querySelector('#btnNewRoom');
  createRoom.addEventListener('click', showCreateScreen);

  const action = document.querySelector('#action');
  action.addEventListener('change', toggleTarget);

  const rules = document.querySelector('#btnRules');
  rules.addEventListener('click', showRules);

  const closeRulesBtn = document.querySelector('#btnCloseRules');
  closeRulesBtn.addEventListener('click', closeRules);
};

window.onload = init;