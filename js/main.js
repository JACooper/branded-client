const socketHandler = require('./socketHandler.js');

const toggleTarget = (e) => {
	const action = document.querySelector('#action');
	const target = document.querySelector('#target');
	if (action.value === 'absolve' || action.value === 'confess') {
		target.disabled = true;
	} else {
		target.disabled = false;
	}
};

const init = () => {
	const connect = document.querySelector('#btnConnect');
	connect.addEventListener('click', socketHandler.connectSocket);

	const action = document.querySelector('#action');
	action.addEventListener('change', toggleTarget);
};

window.onload = init;