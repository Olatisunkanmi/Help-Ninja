const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const Socket = require('./socket');

const appConfig = async (app) => {
	// Set up server
	const server = http.createServer(app);

	// Set up socket
	const io = Socket.createSocket(server);

	// Set static files
	app.use(express.static(path.join(__dirname, '../public')));

	const PORT = 9000;
	// Listen to port
	server.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
};

module.exports = appConfig;
