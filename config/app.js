const express = require('express');
const http = require('http');
const path = require('path');
const Socket = require('../app/socket/socket');

const appConfig = async (app) => {
	// Set up server
	const server = http.createServer(app);

	// Set up socket
	const { SocketInstance } = Socket.createSocket(server);
	SocketInstance(server);
	// Set static files
	app.use(express.static(path.join(__dirname, '../public')));

	const PORT = 9000;
	// Listen to port
	server.listen(PORT, () => {
		logger.info(`Server running on port ${PORT}`);
	});
};

module.exports = appConfig;
