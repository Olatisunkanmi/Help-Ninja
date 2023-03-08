const socket = require('socket.io');
const Helper = require('./helper');
const cors = require('cors');

class Socket {
	constructor(server) {
		this.io = socket(server, { cors: { origin: '*' } });
		this.botName = 'Help Ninja Bot';
		this.initializeSocket();
	}

	initializeSocket() {
		// Run when client connects
		this.io.on('connection', (socket) => {
			// Listen to new user connection
			console.log(`New User Connected ${socket.id}`);

			// Welcome user
			// Only user can see
			socket.emit(
				'botMessage',
				Helper(
					this.botName,
					'Welcome to Help Ninja, I will be your personal AI assistant',
				),
			);

			// Broadcast to channel except user
			// Broadcast when a user connects
			socket.broadcast.emit(
				'notification',
				Helper(this.botName, 'A User has joined the chat'),
			);

			// Everyone
			// Runs when a client disconnects
			socket.on('disconnect', () => {
				this.io.emit(
					'notification',
					Helper(this.botName, 'A User has left the chat'),
				);
			});

			socket.on('chatMessage', (msg) => {
				this.io.emit('userMessage', Helper('USER', msg));
			});

			socket.on('botMessage', (msg) => {
				this.io.emit('message', Helper('USER', msg));
			});

			socket.on('register', (data) => {
				this.io.emit('access', data);
			});
		});
	}
}

module.exports = Socket;
