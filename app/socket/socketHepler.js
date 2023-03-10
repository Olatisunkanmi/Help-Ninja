const StoreService = require('../services/store');

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
		let botResponse, displayOptions, userResponse;

		const greetings = ['hello', 'hi', 'hey', 'sup', 'yo', 'wassup'];
		const affirmativeWords = [
			'fine',
			'good',
			'great',
			'awesome',
			'cool',
			'nice',
			'ok',
			'okay',
			'alright',
		];
		const farewellWords = [
			'bye',
			'goodbye',
			'see you',
			'see ya',
			'cya',
			'ttyl',
			'talk to you later',
			'talk to you soon',
		];
		const appreciationWords = ['thank you', 'appreciate'];
		const inquiryWords = [
			'who are you',
			'what is your name',
			'what do you do',
		];
		const helpWords = [
			'help',
			'support',
			'assistance',
			'assist',
			'assist me',
			'help me',
			'support me',
			'assistance me',
		];

		botResponse = 'Sorry, I did not understand.';
		// displayOptions = 'Please choose from the following options:';

		if (greetings.some((word) => message.includes(word))) {
			botResponse = 'Hello, how are you?';
		} else if (
			affirmativeWords.some((word) => message.includes(word))
		) {
			botResponse = 'That is great to hear, How can I help you?';
			displayOptions = 'help';
		} else if (farewellWords.some((word) => message.includes(word))) {
			botResponse = 'Goodbye, have a nice day.';
		} else if (
			appreciationWords.some((word) => message.includes(word))
		) {
			botResponse = 'You are welcome.';
		} else if (inquiryWords.some((word) => message.includes(word))) {
			botResponse = 'I am a chatbot.';
		} else if (helpWords.some((word) => message.includes(word))) {
			botResponse = 'How can I help you?';
		} else if (message == '99') {
			botResponse = 'Thank you for shopping with us.';
		} else if (message == '98') {
			botResponse = 'Your order history is as follows:';
		} else if (message == '97') {
			botResponse = 'Your current order is as follows:';
			displayOptions = 'current';
		} else if (message == '96') {
			botResponse = 'Shop items are as follows:';
			displayOptions = 'shopItems';
		} else if (message == '0') {
			botResponse = `Your order has been cancelled. Thank you for shopping with us. </br> Would you like to shop again?`;
			displayOptions = 'shop';
		} else if (message == '94') {
			botResponse = 'Your order details are as follows:';
			displayOptions = 'order';
		} else {
			botResponse =
				'Sorry, I did not understand, Help me understand by choosing from the following options:';
			displayOptions = 'help';
		}

		return { botResponse, displayOptions };
	}

	/**
	 * @static
	 * @function _displayOptions - displays options to the user
	 * @memberof socketHelper
	 * @returns {array} _displayOptions - array of options to display to the user
	 */

	static _displayOptions(displayOptions) {
		let options = [];

		if (displayOptions == 'help') {
			options = [
				'Press 99. To checkout order',
				'Press 98. To view Order History',
				'Press 97. To view Current Order ',
				'Press 96. To view Shop Items',
				'Press 0. To cancel order',
			];
		} else if (displayOptions == 'shop') {
			options.push('Press 96. To view Shop Items');
		}

		return options;
	}

	/**
	 * @static
	 * @function _getStoreItems - gets the store items
	 * @memberof socketHelper
	 * @returns {array} items - array of store items
	 */
	static async _getStoreItems() {
		return await StoreService.getStoreItems();
	}
}

module.exports = socketHelper;
