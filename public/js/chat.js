const socket = io();

socket.on('chatMessage', (msg) => {
	console.log(msg);
});

//using closures and IIFEs

//UI Controller

let uiController = (() => {
	//private
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
let socketController = (() => {
	let socket = io();

	socket.on('chatMessage', (msg) => {
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

//App Controller
let appController = ((uiController, socketController) => {
	let dom = uiController.getInputs();

	let eventListeners = () => {
		dom.chatForm.addEventListener('submit', (e) => {
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
