const express = require('express');
const http = require('http');
const socket = require('socket.io');
const path = require('path');
const cors = require('cors');
const Helper = require('./helper');

const appConfig = async (app) => {
	//set up server
	const server = http.createServer(app);

	//set up socket
	const io = socket(server, { cors: { origin: '*' } });

	//set static files
	app.use(express.static(path.join(__dirname, '../public')));

	const botName = 'ChatCord Bot';

	//run when  client connects
	io.on('connection', (socket) => {
		//listen to new user connection
		logger.warn(`New User Connected ${socket.id}`);

		// Welcome user
		//only user can see
		socket.emit(
			'botMessage',
			Helper(
				botName,
				'Welcome to ChatCord, I will be your personal AI assistant',
			),
		);

		//broadcast to channel except user
		//broadcast when a user connects
		socket.broadcast.emit(
			'notification',
			Helper(botName, 'A User has joined the chat'),
		);

		//Everyone
		//runs when a client disconnect
		socket.on('disconnect', () => {
			io.emit(
				'notification',
				Helper(botName, 'A User has left the chat'),
			);
		});

		socket.on('chatMessage', (msg) => {
			io.emit('userMessage', Helper('USER', msg));
		});

		socket.on('botMessage', (msg) => {
			io.emit('message', Helper('USER', msg));
		});

		socket.on('register', (data) => {
			io.emit('access', data);
		});
	});

	const PORT = 9000;
	//listen to port
	server.listen(PORT, () => {
		logger.info(`HELP NINJA RUNNING ON PORT ${PORT} `);
	});
};

module.exports = appConfig;
