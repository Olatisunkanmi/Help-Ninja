const socket = require('socket.io');
const Helper = require('./helper');
const socketHelper = require('./socketHepler');
const cors = require('cors');

class Socket {
	constructor(server) {
		this.io = socket(server, { cors: { origin: '*' } });
		this.botName = 'Help Ninja Bot';
		this.userName = 'Olasunkanmi';
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
	 * @function _runBot
	 * @param {object} socket
	 * @param {object} msg - Bot response to user message
	 * @memberof Socket
	 * @returns {function} _emitBotMessage - returns bot message to the chatroom
	 */
	_runBot = (socket, msg) => {
		let { botResponse, displayOptions } = socketHelper._runBot(msg);
		this._emitBotMessage(socket, botResponse);

		displayOptions ? this._displayOptions(socket) : null;
	};

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

			this._runBot(socket, msg);
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

	_listenbotMessage(socket) {
		socket.on('botMessage', (msg) => {
			console.log('Bot message', msg);
		});
	}

	_displayOptions(socket) {
		this._emitNotification(socket, 'Please select an option');
		this._emitNotification(socket, '1. Register');
		this._emitNotification(socket, '99. To checkout order');
		this._emitNotification(socket, '98, To view Order History');
		this._emitNotification(socket, '97, To view Current Order');
		this._emitNotification(socket, '96, To view Order Status');
	}

	/**
	 * @private
	 * @function initializeSocket
	 * @memberof Socket
	 * @returns {function} _listenRegister - listens for register
	 * @returns {function} _emitNotification - emits notification to the chatroom
	 * @returns {function} _emitBotMessage - emits bot message to the chatroom
	 * @returns {function} _listenToChatMessage - listens for chat message
	 * @description Initializes socket
	 * @listens for connection
	 * @emits userMessage
	 * @emits botMessage
	 * @emits notification
	 * @emits disconnect
	 * @emits access
	 */

	initializeSocket() {
		// Run when client connects
		this.io.on('connection', (socket) => {
			// Listen for register
			this._listenRegister(socket);

			// Emit to the new user only
			this._emitNotification(
				socket,
				'Hello, you are connected to Help Ninja',
			);

			//Emit options to user
			this._displayOptions(socket);

			// Emit bot message
			this._emitBotMessage(socket, 'Welcome to Help Ninja');

			// Listen to chat message from user
			this._listenToChatMessage(socket);
		});
	}

	/**
	 * @static
	 * @function createSocket
	 * @param {object} server- server instance
	 * @memberof Socket
	 * @returns {object} socketInstance - returns socket instance
	 * @description Creates a socket instance
	 */
	static createSocket(server) {
		const socketInstance = new Socket(server);
		return socketInstance.initializeSocket();
	}
}

module.exports = Socket;
