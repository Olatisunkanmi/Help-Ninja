const socket = require('socket.io');
const Helper = require('./helper');
const cors = require('cors');

/**
 * @class Socket
 * @classdesc Socket class
 * @param {object} server
 * @returns {object} io
 * @constructor Socket
 */
class Socket {
	constructor(server) {
		this.io = socket(server, { cors: { origin: '*' } });
		this.botName = 'Help Ninja Bot';
		this.userName = 'Olasunkanmi';
		this.io = this.initializeSocket();
	}

	/**
	 * @private
	 * @function _emitUserMessage
	 * @param {object} socket
	 * @param {object} message
	 * @emits userMessage - when a user sends a message
	 * @memberof Socket
	 * @returns {object} message - returns user message to the chatroom
	 */
	_emitUserMessage(socket, message) {
		socket.emit('userMessage', Helper(this.userName, message));
	}

	/**
	 * @private
	 * @function _emitBotMessage
	 * @param {object} socket
	 * @param {object} message
	 * @emits botMessage - when the chatbot sends a message
	 * @memberof Socket
	 * @returns {object} message - returns bot message to the chatroom
	 */
	_emitBotMessage(socket, message) {
		socket.emit('botMessage', Helper(this.botName, message));
	}

	/**
	 * @private
	 * @function _emitNotification
	 * @param {object} socket
	 * @param {object} message
	 * @emits notification - when a user joins or leaves the chatroom
	 * @memberof Socket
	 * @returns {object} message - returns notification to the chatroom
	 */
	_emitNotification(socket, message) {
		socket.emit('notification', Helper(this.botName, message));
	}

	/**
	 * @private
	 * @function _broadcastNotification
	 * @param {object} socket
	 * @param {object} message
	 * @emits notification - when a user joins or leaves the chatroom
	 * @memberof Socket
	 * @returns {function} _emitNotification - returns notification to the chatroom
	 */
	_broadcastNotification(socket, message) {
		this._emitNotification(socket.broadcast, message);
	}

	/**
	 * @private
	 * @function _emitDisconnect
	 * @param {object} socket
	 * @param {object} message
	 * @emits disconnect - when a user disconnects from the chatroom
	 * @memberof Socket
	 * @returns {function} _broadcastNotification - returns notification to the chatroom
	 */
	_emitDisconnect(socket, message) {
		socket.on('disconnect', () => {
			this._broadcastNotification(socket, message);
		});
	}

	/**
	 * @private
	 * @function _listenToChatMessage
	 * @param {object} socket
	 * @listens for chatMessage - when a user sends a message
	 * @emits userMessage
	 * @memberof Socket
	 * @returns {function} _emitUserMessage - returns user message to the chatroom
	 *
	 */
	_listenToChatMessage(socket) {
		socket.on('chatMessage', (msg) => {
			this._emitUserMessage(socket, msg);
		});
	}

	/**
	 * @private
	 * @function _listenRegister
	 * @param {object} socket
	 * @listens for register - when a user registers
	 * @emits access - when a user registers and is granted access
	 * @memberof Socket
	 */
	_listenRegister(socket) {
		socket.on('register', (data) => {
			this.io.emit('access', data);
		});
	}

	//create a function to emit to a specific user
	// _emitToUser(event, data, userId) {
	// 	this.io.to(userId).emit(event, data);
	// }

	/**
	 * @static
	 * @function createSocket
	 * @param {object} server
	 * @memberof Socket
	 * @returns {object} io - returns socket.io instance
	 *
	 */

	initializeSocket() {
		// Run when client connects
		this.io.on('connection', (socket) => {
			// Listen to new user connection
			logger.info(`New User Connected ${socket.id}`);

			// Emit bot message
			this._emitBotMessage(socket, 'Welcome to Help Ninja');

			// Broadcast to chatroom
			this._broadcastNotification(
				socket,
				'A User has joined the chat',
			);

			// Emit to the new user only
			this._emitNotification(socket, 'You have joined the chat');

			//Emit when user disconnects
			this._emitDisconnect(socket, 'A User has left the chat');

			// Listen for chatMessage
			this._listenToChatMessage(socket);

			// Listen for register
			this._listenRegister(socket);
		});
	}

	/**
	 * @static
	 * @function createSocket
	 * @param {object} server
	 * @memberof Socket
	 * @returns {object} io - returns socket.io instance
	 * @description Creates a socket instance
	 */
	// static createSocket(server) {
	// 	const socketInstance = new Socket(server);

	// 	return socketInstance.initializeSocket();
	// }
}

module.exports = Socket;
