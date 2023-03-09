/**
 * @class socketHelper
 * @description socketHelper class
 * @exports socketHelper
 * @classdesc socketHelper class
 */

class socketHelper {
	/**
	 * @static
	 * @function _runBot - runs the chatbot
	 * @param {object} message
	 * @memberof socketHelper
	 * @returns {string} message - bot message according to the user input
	 * @description _runBot function
	 */
	static _runBot(msg) {
		const message = msg.toLowerCase();

		let botResponse, displayOptions;
		if (
			message.includes('hello') ||
			message.includes('hi') ||
			message.includes('hey') ||
			message.includes('sup') ||
			message.includes('yo') ||
			message.includes('wassup') ||
			message.includes('wassup')
		) {
			botResponse = 'Hello, how are you?';
		} else if (
			message.includes('fine') ||
			message.includes('good') ||
			message.includes('great') ||
			message.includes('awesome') ||
			message.includes('cool') ||
			message.includes('nice') ||
			message.includes('ok') ||
			message.includes('okay') ||
			message.includes('alright')
		) {
			botResponse =
				'Nice to hear that, How can I be of assistance to you';
			displayOptions = 'help';
		} else if (
			message.includes('bye') ||
			message.includes('goodbye') ||
			message.includes('see you') ||
			message.includes('see ya') ||
			message.includes('cya') ||
			message.includes('ttyl') ||
			message.includes('talk to you later') ||
			message.includes('talk to you soon')
		) {
			botResponse = 'Bye, have a nice day 👋🏼';
		} else if (
			message.includes('thank you') ||
			message.includes('appreciate')
		) {
			botResponse = 'You are welcome';
		} else if (
			message.includes('who are you') ||
			message.includes('what is your name') ||
			message.includes('what do you do')
		) {
			botResponse =
				'My name is Chatbot, Your personal shopping assistant';
		} else if (
			message.includes('help') ||
			message.includes('support') ||
			message.includes('assistance') ||
			message.includes('assist') ||
			message.includes('assist me') ||
			message.includes('help me') ||
			message.includes('support me') ||
			message.includes('assistance me')
		) {
			botResponse = 'Below are a few options to help you get started';
			displayOptions = 'help';
		} else {
			botResponse = "I don't understand";
			displayOptions = 'help';
		}
		return { botResponse, displayOptions };
	}

	/**
	 * @static
	 * @function _emitNotification - emits a notification to the chatrom
	 * @param {object} socket
	 * @param {function} _emitNotification - emits a notification to the chatrom
	 * @memberof socketHelper
	 * @description _emitNotification function
	 */

	static _displayOptions(sock, _emitNotification) {
		return [
			'1. Register',
			'99. To checkout order',
			'98, To view Order History',
			'97, To view Current Order ',
			'96, To view Order Status',
			'95, To view Order Details',
		];
	}
}
module.exports = socketHelper;
