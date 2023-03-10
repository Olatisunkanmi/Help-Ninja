// This file is for the chat page
//Use closure to protect variables from global scope and to create private methods and variables that can only be accessed by the public methods and variables
// that are returned by the IIFE (Immediately Invoked Function Expression) that is used to create the module. This is called the Module Pattern.

/**************USER DATA************************ */

/***********************SESSION STORAGE*********************** */

/**
 * @static
 * @private
 * @returns {object} sessionStorage
 * @memberof sessionStorage
 * @description sessionStorage module
 */
const sessionStorage = (() => {
	const _addUser = (user) => {
		const userSession =
			JSON.parse(localStorage.getItem(storageKey)) || [];

		console.log(userSession);
		userSession[user.id] = user;

		localStorage.setItem(storageKey, JSON.stringify(user));
	};

	const _getUser = (id) => {
		const userSession =
			JSON.parse(localStorage.getItem(storageKey)) || [];
		return userSession[id];
	};

	const _removeUser = (id) => {
		const userSession =
			JSON.parse(localstorage.getItem(storageKey)) || [];
		delete userSession[id];
		localStorage.setItem(storageKey, JSON.stringify(userSession));
	};

	const _getAllUsers = () => {
		const allUsers =
			JSON.parse(localStorage.getItem(storageKey)) || [];
		return allUsers;
	};

	const _updateUser = (id, user) => {};

	return {
		_addUser,
		_getUser,
		_removeUser,
		_getAllUsers,
	};
})();

/***********************UI CONTROLLER*********************** */

/**
 * @static
 * @private
 * @returns {object} getDomStrings
 * @membof uiController
 */
const uiController = (() => {
	//All DOM Strings
	let allDomStrings = {
		/**
		 * @param {string} chatForm - The chat form
		 * @param {string} message - The message input
		 * @param {string} chatThread - The chat thread
		 */

		chatForm: '.chat-form',
		message: '.message',
		chatThread: '.chat-thread',
		notification: '.notification',
	};

	const displayItem = () => {
		const shopItems = [];
	};

	const appendDOM = (message, html) => {
		//choose the element to insert the HTML into
		element = allDomStrings.chatThread;

		//replace the placeholder text with some actual data
		newHtml = html.replace('%username%', message.username);
		newHtml = newHtml.replace('%message%', message.text);
		newHtml = newHtml.replace('%time%', message.time);

		//insert the HTML into the DOM
		document
			.querySelector(element)
			.insertAdjacentHTML('beforeend', newHtml);
	};

	//Public methods
	return {
		getInputs: () =>
			/**
			 * @static
			 * @private
			 * @returns {object} chatForm, message, chatThread
			 * @summary Get all inputs
			 * @memberof uiController
			 */
			({
				chatForm: document.querySelector(allDomStrings.chatForm),
				message: document.querySelector(allDomStrings.message),
				chatThread: document.querySelector(allDomStrings.chatThread),
				notificationThread: document.querySelector(
					allDomStrings.notification,
				),
			}),

		/**
		 * @static
		 * @private
		 * @returns {object } - function to append messages and notifications to the DOM
		 * @memberof uiController
		 */

		appendMessage: () => {
			let html, element;

			return {
				appendChat: (message) => {
					if (message.username.includes('Bot')) {
						html =
							'<li> <div class="botMessages anim-typewriter"><p class="meta">%username% <span>%time%</span></p><p class="text">%message%</p></div></li>';
					} else {
						html =
							'<li> <div class="messages"><p class="meta">%username% <span>%time%</span></p><p class="text">%message%</p></div></li>';
					}

					appendDOM(message, html);
				},

				appendNotification: (message) => {
					html =
						'<li> <div class="notification"> <div class="notify">%message%</div></div> </li>';

					appendDOM(message, html);
				},
			};
		},

		/**
		 * @private
		 * @returns {object} allDomStrings
		 */
		getDomStrings: () => allDomStrings,
	};
})();

/***********************SOCKET CONTROLLER*********************** */

/**
 * @static
 * @private
 * @function socketController
 * @returns {object} socket
 */

let socketController = (() => {
	const socket = io();

	/**
	 * @private
	 * @listens for botMessage -  when the chatbot sends a message
	 * @emits botMessage
	 * @returns {object} message
	 */
	socket.on('botMessage', (msg) => msg);

	/**
	 * @private
	 * @listens for notification - when the chatbot sends a notification
	 * @emits notification
	 * @returns {object} message
	 */
	socket.on('notification', (msg) => msg);

	/**
	 * @private
	 * @listens when a user connects to the chatRoom
	 * @emits access
	 * @returns {object} message
	 * @memberof socketController
	 */
	socket.on('access', (msg) => msg);

	/**
	 * @private
	 * @listens when a user sends a message in the chatRoom
	 * @emits message
	 * @returns {object} message
	 * @memberof socketController
	 */
	socket.on('userMessage', (msg) => msg);

	socket.on('shopItems', (msg) => msg);

	return {
		getSocket: {
			socket: socket,
		},
	};
})();

/***************APP CONTROLLER **************************************/

/**
 * @static
 * @private
 * @returns {object} init
 * @summary This is the main controller
 *	@memberof appController
 */
const appController = ((
	uiController,
	socketController,
	sessionStorage,
) => {
	//Get the socket
	const { socket } = socketController.getSocket;

	//Get the UI controllers
	const { appendMessage, getInputs } = uiController;
	const { appendChat, appendNotification } = appendMessage();
	const { chatForm, chatThread } = getInputs();

	//Get the session storage
	// const { getItem, setItem } = sessionStorage;

	const user = {
		username: 'Guest',
		email: 'user@mail.com',
		cart: [
			{
				name: 'product1',
				price: 100,
				quantity: 1,
			},
			{
				name: 'product2',
				price: 200,
				quantity: 1,
			},
		],
	};

	/**
	 * @private
	 * @returns {object} eventListeners
	 * @summary This is the main controller
	 * @memberof appController
	 */
	const init = () => {
		socket.on('botMessage', (message) => {
			appendChat(message);

			scrollToBottom();
		});

		socket.on('notification', (message) => {
			appendNotification(message);

			scrollToBottom();
		});

		socket.on('userMessage', (message) => {
			console.log(message);

			// sessionStorage._addUser(user);

			appendChat(message);
			scrollToBottom();
		});

		socket.on('shopItems', (message) => {
			console.log(message);
		});
	};

	//Listen to user chat input
	chatForm.addEventListener('keypress', (e) => {
		if (e.keyCode === 13) {
			//Enter key
			e.preventDefault();
			socket.emit('chatMessage', e.target.value);
			e.target.value = '';
		}
	});

	//save user seesion to local storage
	const saveSession = (options) => {
		// setItem
		setItem('username', 'options.username');
	};

	//scroll to bottom of chat
	const scrollToBottom = () => {
		chatThread.scrollTop = chatThread.scrollHeight;
	};

	return {
		init: () => {
			init();
		},
	};
})(uiController, socketController, sessionStorage);

appController.init();
