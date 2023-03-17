const StoreService = require('../services/store');
const constants = require('../utils/constants');

const {
	APPRECIATION_WORDS,
	GREETINGS,
	AFFIRMATIVE_WORDS,
	FAREWELL_WORDS,
	INQUIRY_WORDS,
	HELP_WORDS,
	GREETINGS_RESPONSE,
	HELP_WORDS_RESPONSE,
	INQUIRY_WORDS_RESPONSE,
	APPRECIATION_WORDS_RESPONSE,
	FAREWELL_WORDS_RESPONSE,
	AFFIRMATIVE_WORDS_RESPONSE,
	CHECKOUT_ORDER,
	CHECKOUT_ORDER_RESPONSE,
	CLEAR_CART,
	CLEAR_CART_RESPONSE,
	ORDER_HISTORY_RESPONSE,
	CURRENT_ORDER_RESPONSE,
	VIEW_SHOP_ITEMS_RESPONSE,
	CANCEL_ORDER_RESPONSE,
	ORDER_HISTORY,
	CURRENT_ORDER,
	VIEW_SHOP_ITEMS,
	CANCEL_ORDER,
	ERROR_RESPONSE,
	USER_SHOPPING_OPTIONS,
} = constants;
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

		if (GREETINGS.some((word) => message.includes(word))) {
			botResponse = GREETINGS_RESPONSE;
		} else if (
			AFFIRMATIVE_WORDS.some((word) => message.includes(word))
		) {
			botResponse = AFFIRMATIVE_WORDS_RESPONSE;
			displayOptions = 'help';
		} else if (
			FAREWELL_WORDS.some((word) => message.includes(word))
		) {
			botResponse = FAREWELL_WORDS_RESPONSE;
		} else if (
			APPRECIATION_WORDS.some((word) => message.includes(word))
		) {
			botResponse = APPRECIATION_WORDS_RESPONSE;
		} else if (INQUIRY_WORDS.some((word) => message.includes(word))) {
			botResponse = INQUIRY_WORDS_RESPONSE;
		} else if (HELP_WORDS.some((word) => message.includes(word))) {
			botResponse = HELP_WORDS_RESPONSE;
			displayOptions = 'help';
		} else if (message == CHECKOUT_ORDER) {
			botResponse = CHECKOUT_ORDER_RESPONSE;
			displayOptions = 'checkout';
		} else if (message == CLEAR_CART) {
			botResponse = CLEAR_CART_RESPONSE;
			displayOptions = 'checkout';
		} else if (message == ORDER_HISTORY) {
			botResponse = ORDER_HISTORY_RESPONSE;
		} else if (message == CURRENT_ORDER) {
			displayOptions = 'cart';
		} else if (message == VIEW_SHOP_ITEMS) {
			botResponse = VIEW_SHOP_ITEMS_RESPONSE;
			displayOptions = 'shopItems';
		} else if (message == CANCEL_ORDER) {
			botResponse = CANCEL_ORDER_RESPONSE;
			displayOptions = 'shop';
		} else {
			botResponse = ERROR_RESPONSE;
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
			options = USER_SHOPPING_OPTIONS;
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
