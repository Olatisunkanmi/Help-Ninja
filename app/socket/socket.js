const socket = require('socket.io');
const Helper = require('../../config/helper');
const socketHelper = require('./socketHepler');
const { _runBot, _displayOptions } = require('./socketHepler');
const constants = require('../utils/constants');
const Joi = require('joi');
const { INVALID_KEY } = require('../utils/constants');

const {
	EMPTY_CART,
	CHAT_BEGINNING,
	NEW_CONNECTION,
	CHECKOUT,
	BOT_NAME,
	BOT_INTRO,
	BOT_INTRO_2,
	SHOPPING_ERROR,
	SHOPPING_SUCCESS,
	DUPLICATE_ORDER,
	GO_TO_CART_PAGE,
	REVIEW,
} = constants;

class Socket {
	constructor(server) {
		this.server = server;
		this.io = socket(server, { cors: { origin: '*' } });
		this.botName = BOT_NAME;
		this.userName = 'User';
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

	_clearUserCart(socket) {
		socket.emit('clearCart');
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

		console.log(displayOptions);

		botResponse ? this._emitBotMessage(socket, botResponse) : null;
		this._displayOptions(socket, displayOptions);

		if (displayOptions === 'shopItems') {
			this._emitShopItems(socket);
		}

		if (displayOptions === 'cart') {
			this._emitCartItems(socket);
		}

		if (displayOptions === 'checkout') {
			this._clearUserCart(socket);
		}

		if (displayOptions === 'orderHisttory') {
			this._emitOrderHistory(socket);
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
		socket.on('chatMessage', async (msg) => {
			const { error, value } = socketHelper._messageSchema.validate({
				message: msg,
			});

			if (error) {
				console.log(error.details[0].message);
				this._emitBotMessage(socket, error.details[0].message);
			} else {
				this._emitUserMessage(socket, msg);
				this._runBot(socket, msg);
			}
		});
	}

	/**
	 * @private
	 * @function _displayOptions
	 * @param {object} socket
	 * @param {object} displayOptions - display shopping options for the user
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
	 * @function _displayCart - displays the items in the cart
	 * @param {object} socket
	 * @param {object} data - cart items
	 * @memberof Socket
	 * @returns {function} _emitBotMessage - returns the items in the cart to the chatroom
	 */

	_displayCart(socket, data) {
		let totalPrice = 0;

		data.forEach((data) => {
			this._emitBotMessage(
				socket,
				`${data.strMeal} - $ ${new Intl.NumberFormat().format(
					data.idMeal,
				)}`,
			);

			//coverts the price to a number
			data.idMeal = Number(data.idMeal);

			totalPrice += data.idMeal;
		});

		this._emitBotMessage(socket, `Total Price: $ ${totalPrice}`);
		this._emitBotMessage(socket, CHECKOUT);
		this._emitBotMessage(socket, GO_TO_CART_PAGE);
	}

	/**
	 * @private
	 * @function _emitUserItems - displays user items in the cart
	 * @param {object} socket
	 * @emits fetchCart - Lets the server know that the user wants to view items in the cart
	 * @listens for cart - receives the items in the cart from local storage
	 * @memberof Socket
	 * @returns {function} _displayCart - returns the items in the cart to the chatroom
	 */
	_emitCartItems(socket) {
		socket.emit('fetchCart');

		socket.on('cart', (data) => {
			if (data.length === 0) {
				this._emitBotMessage(socket, EMPTY_CART);
			} else {
				this._displayCart(socket, data);
			}
		});
	}

	/**
	 * @private
	 * @function _emitOrderHistory - displays user order history
	 * @param {object} socket
	 * @emits fetchOrderHistory - Lets the server know that the user wants to view order history
	 * @listens for orderHistory - receives the order history from local storage
	 * @memberof Socket
	 * @returns {function} _displayOrderHistory - returns the order history to the chatroom
	 * @returns {function} _emitBotMessage - returns the order history to the chatroom
	 */

	_emitOrderHistory(socket) {
		socket.emit('fetchOrderHistory');

		socket.on('orderHistory', (data) => {
			if (data.length === 0) {
				this._emitBotMessage(socket, EMPTY_ORDER_HISTORY);
			} else {
				this._displayCart(socket, data);
			}
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
			logger.info(NEW_CONNECTION(socket.id));

			// Listen for register
			this._listenRegister(socket);

			// Emit to the new user only
			this._emitNotification(socket, CHAT_BEGINNING);

			// Emit bot message
			this._emitBotMessage(socket, BOT_INTRO);

			this._emitBotMessage(socket, BOT_INTRO_2);

			socket.on('notification', (msg) => {
				if (!msg) {
					this._emitBotMessage(socket, SHOPPING_ERROR);
				} else {
					this._emitNotification(
						socket,
						SHOPPING_SUCCESS(msg.strMeal),
					);
				}
			});

			socket.on('botMessage', (msg) => {
				this._emitBotMessage(socket, DUPLICATE_ORDER(msg.strMeal));
			});

			//Emit options to user
			this._displayOptions(socket, 'help');

			// Listen to chat message from user
			this._listenToChatMessage(socket);
		});

		this.io.of('/chectout').on('connection', (socket) => {
			console.log('checkout connected');
			socket.on('checkout', (msg) => {
				console.log('checkout', msg);
				this.io.of('/chectout').emit('checkout', msg);
			});
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

		return {
			SocketInstance: _createSocketInstance,
		};
	}
}

module.exports = Socket;
