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
		itemsDiv: '.store-items',
	};

	const displayItems = (items) => {
		const container = document.querySelector(
			allDomStrings.chatThread,
		);

		//create a list inside the container
		const list = document.createElement('li');
		list.classList.add('store-items');
		container.appendChild(list);

		items.forEach((item) => {
			// Replace the placeholders in the HTML template with data from the item
			const htmlTemplate = `<div class="container">
			<div class="banner-wrapper">
			  <div class="banner-image">%image%</div>
			  <h1 class="image-text">%img-text%</h1>
			  <p class="image-desc">%img-desc%</p>
			</div>
			<div class="button-wrapper">
			  <button class="btn fill">BUY NOW</button>
			</div>
		  </div>`;

			let newHtml = htmlTemplate.replace('%image%', item.image);
			newHtml = newHtml.replace('%img-text%', item.title);
			newHtml = newHtml.replace('%img-desc%', item.description);

			// Insert the new HTML into the list item element
			list.insertAdjacentHTML('beforeend', newHtml);

			// Append the list item element to the container
			container.appendChild(list);
		});
	};

	const appendDOM = (message, html, element) => {
		//choose the element to insert the HTML into

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
				itemsDiv: document.querySelector(allDomStrings.itemsDiv),
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
					element = allDomStrings.chatThread;

					if (message.username.includes('Bot')) {
						html =
							'<li> <div class="botMessages anim-typewriter"><p class="meta">%username% <span>%time%</span></p><p class="text">%message%</p></div></li>';
					} else {
						html =
							'<li> <div class="messages"><p class="meta">%username% <span>%time%</span></p><p class="text">%message%</p></div></li>';
					}

					appendDOM(message, html, element);
				},

				appendNotification: (message) => {
					element = allDomStrings.chatThread;
					html =
						'<li> <div class="notification"> <div class="notify">%message%</div></div> </li>';

					appendDOM(message, html, element);
				},

				appendItems: (items) => {
					displayItems(items);
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
	const { appendChat, appendNotification, appendItems } =
		appendMessage();
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
			appendItems(message);
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
