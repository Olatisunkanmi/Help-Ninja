const socket = require('socket.io');
const Helper = require('../../config/helper');
const socketHelper = require('./socketHepler');
const { _runBot, _displayOptions } = require('./socketHepler');

class Socket {
	constructor(server) {
		this.server = server;
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
	 * @function _runBot
	 * @param {object} socket
	 * @param {object} msg - Bot response to user message
	 * @memberof Socket
	 * @returns {function} _emitBotMessage - returns bot message to the chatroom
	 */
	_runBot = async (socket, msg) => {
		let { botResponse, displayOptions } = socketHelper._runBot(msg);
		this._emitBotMessage(socket, botResponse);
		this._displayOptions(socket, displayOptions);

		if (displayOptions === 'shopItems') {
			this._emitShopItems(socket);
		}
	};

	/**
	 * @private
	 * @function _listensToChatMessage
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

	//create a function to emit to a specific user
	// _emitToUser(event, data, userId) {
	// 	console.log(event, data, userId);
	// 	this.io.to(userId).emit(event, data);
	// }

	_listenbotMessage(socket) {
		socket.on('botMessage', (msg) => {
			console.log('Bot message', msg);
		});
	}

	/**
	 * @private
	 * @function _displayOptions
	 * @param {object} socket
	 * @param {object} displayOptions - Notification to chatroom
	 * @memberof Socket
	 * @returns {function} _emitNotification - returns bot message to the chatroom
	 */

	_displayOptions(socket, displayOptions) {
		let options = socketHelper._displayOptions(displayOptions);

		options.forEach((option) => {
			this._emitNotification(socket, option);
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
	 * @emits disconnect - when a user disconnects from the chatroom
	 * @memberof Socket
	 * @returns {function} _broadcastNotification - returns notification to the chatroom
	 */
	_emitDisconnect(socket) {
		socket.on('disconnect', (reason) => {
			this._broadcastNotification(socket, reason);
		});
	}

	/**
	 * @private
	 * @function _sendStoreItems
	 * @memberof Socket
	 * @returns {object} storeItems - returns store items to the chatroom
	 */

	_emitShopItems = async () => {
		const storeItems = await socketHelper._getStoreItems();

		this.io.emit('shopItems', storeItems);
	};

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
		this.io.on('connection', (socket) => {
			logger.info(
				'New WS Connection...' +
					socket.id +
					' connected at ' +
					new Date(),
			);

			//restrict multiple connections from same user
			// if (this.users[socket.id]) {
			// 	this._emitNotification(
			// 		socket,
			// 		'You are already connected to Help Ninja',
			// 	);
			// 	return;
			// }

			// Listen for register
			this._listenRegister(socket);

			// Emit to the new user only
			this._emitNotification(
				socket,
				'Hello, you are connected to Help Ninja',
			);

			// Emit bot message
			this._emitBotMessage(
				socket,
				'Hello there ! I am Help Ninja, your personal shopping assistant',
			);

			this._emitBotMessage(
				socket,
				'Below are some of the things I can help you with',
			);

			//Emit options to user
			this._displayOptions(socket, 'help');

			// Listen to chat message from user
			this._listenToChatMessage(socket);

			//display shopt items to users

			//Listen for disconnect from user
			// this._emitDisconnect(socket);

			// socket.emit('storeItems', 'storeItems');
		});

		// return this.io;
	}

	/**
	 * @private
	 * @function initializaStoreSocket
	 * @memberof Socket
	 * @description Initializes store socket for store items
	 * @listens for connection to store namespace and emits storeItems
	 * @emits storeItems
	 * @returns {function} _sendStoreItems - returns store items to the chatroom
	 */

	initializaStoreSocket() {
		const storeNsp = this.io.of('/store');
		storeNsp.on('connection', (socket) => {
			logger.warn(
				'New WS Connection to the store...' +
					socket.id +
					' connected ' +
					new Date(),
			);
			storeNsp.emit('storeItems', this._sendStoreItems());
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
		const _createSocketInstance = (server) => {
			const socketInstance = new Socket(server);
			return socketInstance.initializeSocket();
		};

		const _createRegisterSocketInstance = (server) => {
			const socketInstance = new Socket(server);
			return socketInstance.initializaStoreSocket();
		};

		return {
			SocketInstance: _createSocketInstance,
			registerSocket: _createRegisterSocketInstance,
		};
	}
}

module.exports = Socket;
