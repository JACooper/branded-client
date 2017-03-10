const socketHandler = require('./socketHandler.js');

const init = () => {
	const connect = document.querySelector('#btnConnect');
	connect.addEventListener('click', socketHandler.connectSocket);
};

window.onload = init;