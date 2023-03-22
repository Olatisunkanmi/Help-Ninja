const express = require('express');
const http = require('http');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const Socket = require('../app/socket/socket');

const appConfig = async (app) => {
	// add helmet middleware to secure Express apps with various HTTP headers
	app.use(helmet());
	// adds middleware for cross-origin resource sharing configuration
	app.use(cors());
	// integrate winston logger with morgan
	app.use(morgan('combined', { stream: logger.stream }));
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
