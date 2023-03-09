// This file is for the chat page
//Use closure to protect variables

/***********************UI CONTROLLER*********************** */

/**
 * @static
 * @private
 * @returns {object} getDomStrings
 * @membof uiController
 */
let uiController = (() => {
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

	//Get all inputs
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

		appendMessage: () => {
			//create HTML string with placeholder text
			let html, newHtml, element;

			function appendDOM(message, html) {
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
			}

			return {
				appendChat: (message) => {
					//choose the element to insert the HTML into
					element = allDomStrings.chatThread;

					//create HTML string with placeholder text
					//if the message is from the user
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
	let socket = io();

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

	return {
		getSocket: () => socket,
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
let appController = ((uiController, socketController) => {
	const socket = socketController.getSocket();
	const { appendMessage, getInputs } = uiController;
	const { appendChat, appendNotification } = appendMessage();
	const { chatForm, chatThread } = getInputs();

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

	//scroll to bottom of chat
	const scrollToBottom = () => {
		chatThread.scrollTop = chatThread.scrollHeight;
	};

	return {
		init: () => {
			init();
		},
	};
})(uiController, socketController);

appController.init();
