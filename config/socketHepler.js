/**
 * @class SocketHelper
 * @description SocketHelper class
 * @exports SocketHelper
 * @classdesc SocketHelper class
 */

class SocketHelper {
	_displayOptions(message) {}

	/**
	 * @private
	 * @function _runBot - runs the chatbot
	 * @param {object} message
	 * @memberof SocketHelper
	 * @returns {string} message - bot message according to the user input
	 * @description _runBot function
	 */
	static _runBot(msg) {
		const message = msg.toLowerCase();

		let botMessage = '';
		if (
			message.includes('hello') ||
			message.includes('hi') ||
			message.includes('hey') ||
			message.includes('sup') ||
			message.includes('yo') ||
			message.includes('wassup') ||
			message.includes('wassup')
		) {
			botMessage = 'Hello, how are you?';
			// botMessage = 'Hello, how are you?';
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
			botMessage = 'Nice to hear that, How can I help you?';
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
			botMessage = 'Bye, have a nice day 👋🏼';
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
			botMessage = message;
		} else {
			botMessage = "I don't understand";
		}
		return botMessage;
	}
}
module.exports = SocketHelper;
