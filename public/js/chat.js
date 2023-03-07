// const socket = io();

// socket.on('chatMessage', (msg) => {
// 	console.log(msg);
// });

//using closures and IIFEs

//UI Controller

/**
 * @static
 * @private
 * @returns {object} getDomStrings
 *
 */
let uiController = (() => {
	let allDomStrings = {
		chatForm: '.chat-form',
		message: '.message',
		chatThread: '.chat-thread',
	};

	return {
		getInputs: function () {
			return {
				chatForm: document.querySelector(allDomStrings.chatForm),
				message: document.querySelector(allDomStrings.message),
				chatThread: document.querySelector(allDomStrings.chatThread),
			};
		},

		getDomStrings: () => allDomStrings,
	};
})();

//Socket Controller
/**
 * @static
 * @private
 * @returns {object} socket
 */
let socketController = (() => {
	let socket = io();

	socket.on('botMessage', (msg) => {
		console.log(msg);
		console.log('chatMessage');
	});

	socket.on('message', (msg) => {
		console.log(msg);
		console.log('message');
	});

	return {
		socket: socket,
	};
})();

/**
 * @static
 * @private
 * @returns {object} init
 */
let appController = ((uiController, socketController) => {
	const { chatForm } = uiController.getDomStrings();

	// let dom = uiController.getInputs();

	let eventListeners = () => {
		chatForm.addEventListener('submit', (e) => {
			e.preventDefault();

			let message = dom.message.value;

			socketController.socket.emit('chatMessage', message);
		});
	};

	return {
		init: () => {
			eventListeners();
		},
	};
})(uiController, socketController);

appController.init();
