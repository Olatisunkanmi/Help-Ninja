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
	const storageKey = 'userSession';
	const cartKey = 'cartItems';
	const orderHistoryKey = 'orderHistory';

	const setSession = (sessionKey, session) => {
		return localStorage.setItem(cartKey, JSON.stringify(userCart));
	};

	const getSession = (sessionKey) => {
		return JSON.parse(localStorage.getItem(sessionKey)) || [];
	};

	const _fetchOrderHistory = () => {
		const orderHistory = getSession(orderHistoryKey);
	};

	const _createOrderHistory = (item) => {
		const orderHistory = setSession(orderHistoryKey, item);
	};

	const _findItem = (item) => {
		const userCart = getSession(cartKey);
		const foundItem = userCart.find((cartItem) => {
			return cartItem.id === item.id;
		});
		return foundItem;
	};

	const _updateCart = (item) => {
		const userCart = getSession(cartKey);
		userCart.push(item);
		setSession(cartKey, userCart);

		return item;
	};

	const _fetchCart = () => {
		const userCart = getSession(cartKey);
		return userCart;
	};

	return {
		_updateCart,
		_fetchCart,
		_findItem,
		_fetchOrderHistory,
		_createOrderHistory,
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
		buyBtn: '.buy-item',
	};

	const getUserSelectedItems = (item) => {
		//Save user selected items to local storage
		const storageKey = 'cartItems';

		const setSelect = (item) => {
			appController.updateCart(item);
		};

		return {
			getSelect: (item) => {
				setSelect(item);
			},
		};
	};

	function btnClick(buttons, onClick, items, getUserSelectedItems) {
		buttons.forEach((button, index) => {
			button.addEventListener('click', () => {
				const click = onClick(items[index]);
				const userSelectedItems = getUserSelectedItems();
				userSelectedItems.getSelect(click);
			});
		});
	}

	const displayItems = (items, onClick) => {
		const userSelectedItems = getUserSelectedItems();

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
			  <button class="btn fill buy-item">Add to Cart</button>
			</div>
		  </div>`;

			const imgElement = document.createElement('img');
			imgElement.src = item.image;

			let newHtml = htmlTemplate.replace(
				'%image%',
				imgElement.outerHTML,
			);
			newHtml = newHtml.replace('%img-text%', item.title);
			newHtml = newHtml.replace('%img-desc%', item.description);

			// Insert the new HTML into the list item element
			list.insertAdjacentHTML('beforeend', newHtml);

			// Append the list item element to the container
			container.appendChild(list);
		});

		// Add event listeners to the buttons
		const buttons = document.querySelectorAll(allDomStrings.buyBtn);
		// btnClick(buttons, onClick, items, getUserSelectedItems);

		buttons.forEach((button, index) => {
			button.addEventListener('click', (e) => {
				const click = onClick(items[index]);
				userSelectedItems.getSelect(click);
			});
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

	//display the items

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
				buyBtn: document.querySelector(allDomStrings.buyBtn),
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
					displayItems(items, (item) => item);
				},
			};
		},

		/**
		 * @private
		 * @returns {object} allDomStrings
		 */
		getDomStrings: () => allDomStrings,

		getUserSelectedItems: () => getUserSelectedItems(),
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
	const cart = io('/cart');

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
	const { appendMessage, getInputs, getUserSelectedItems } =
		uiController;
	const { appendChat, appendNotification, appendItems } =
		appendMessage();
	const { chatForm, chatThread, buyBtn } = getInputs();
	const selectedItems = uiController.getUserSelectedItems();

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
			appendChat(message);
			scrollToBottom();
		});

		socket.on('shopItems', (message) => {
			const userItems = [];
			appendItems(message, userItems);
			scrollToBottom();
		});

		socket.on('fetchCart', () => {
			const cart = sessionStorage._fetchCart();
			socket.emit('cart', cart);
		});
	};

	const fetchCart = () => {
		return sessionStorage._fetchCart();
	};

	const findItemandAdd = (userItem) => {
		return sessionStorage._findItem(userItem)
			? null
			: sessionStorage._updateCart(userItem);
	};

	//Get user selected items and notify the server
	const updateCart = (item) => {
		if (!item) {
			socket.emit('notification', item);
		}

		if (item) {
			const ifItemExist = findItemandAdd(item);
			console.log(ifItemExist);
			if (!ifItemExist) {
				socket.emit('botMessage', item);
			} else {
				socket.emit('notification', item);
			}
		}
	};

	//Listen to user chat input
	chatForm.addEventListener('keypress', (e) => {
		if (e.keyCode === 13) {
			e.preventDefault();
			socket.emit('chatMessage', e.target.value);
			e.target.value = '';
		}
	});

	//scroll to bottom of chat
	const scrollToBottom = () => {
		chatThread.scrollTop = chatThread.scrollHeight;
	};

	return {
		init: () => {
			init();
		},

		updateCart: (item) => {
			updateCart(item);
		},
	};
})(uiController, socketController, sessionStorage);

appController.init();
