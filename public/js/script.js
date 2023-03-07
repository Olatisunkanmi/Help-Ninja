const socket = io();

const registerForm = document.getElementById('register-form');

socket.on('connection', (data) => {
	console.log('data');
});

registerForm.addEventListener('submit', (e) => {
	// e.preventDefault();

	const name = document.getElementById('name').value;
	const email = document.getElementById('email').value;
	const password = document.getElementById('pass').value;

	//send data to server
	socket.emit('register', {
		name,
		email,
		password,
	});
});
