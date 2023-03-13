module.exports = {
	FAIL: 'Fail',
	SUCCESS: 'Success',
	WELCOME: 'WELCOME TO THE CHAT',
	BOT_NAME: 'Help Ninja Bot',
	BOT_INTRO:
		'Hello there ! I am Help Ninja, your personal shopping assistant !',
	BOT_INTRO_2: 'Below are some of the things I can help you with:',

	// CHAT
	CHAT_BEGINNING:
		'THIS IS THE BEGINNING OF YOUR CHAT WITH HELP NINJA',
	INVALID_KEY: 'YOU HAVE ENTERED AN INVALID KEY',
	MODULE_ERROR_STATUS: 'A MODULE PROCESS BROKE',
	MODULE_ERROR: 'ERROR IN MODULE',
	INTERNAL_SERVER_ERROR: 'INTERNAL SERVER ERROR',
	API_NOT_FOUND: 'METHOD OR ROUTE DOES NOT EXIST',
	CHECKOUT:
		'Would you like to checkout?  Press 99 to checkout. </br > </br > Press 90 to clear your cart',
	HELP: 'Help me understand by choosing from the following options:',

	NEW_CONNECTION: (id) =>
		`NEW WEBSOCKET CONNECTION ESTABLISHED WITH ID: ${id} at ${new Date()}`,

	// SHOPPING
	SHOPPING_INTRO: 'You can shop for the following items:',
	SHOPPING_INTRO_2: 'Please select an item to add to your cart',
	SHOPPING_ERROR: `There was an error adding your order to your cart, kindly refresh the page and try again`,
	SHOPPING_SUCCESS: (item) =>
		`Your Order ${item} has been added to Your Cart </br> Press 97 to view your cart `,
	DUPLICATE_ORDER: (item) =>
		`${item} already exists in your cart.  </br> Press 97 to view your Cart`,

	//BOT RESPONSES

	//RANDOM
	REVIEW: `ON A SCALE OF 1 TO 10, HOW WOULD YOU RATE YOUR EXPERIENCE WITH HELP NINJA?`,
	GREETINGS: ['hello', 'hi', 'hey', 'sup', 'yo', 'wassup'],
	GREETINGS_RESPONSE: `HELLO! HOW ARE YOU?`,
	AFFIRMATIVE_WORDS: [
		'fine',
		'good',
		'great',
		'awesome',
		'cool',
		'nice',
		'ok',
		'okay',
		'alright',
	],
	AFFIRMATIVE_WORDS_RESPONSE: `GREAT! I'M GLAD TO HEAR THAT`,
	FAREWELL_WORDS: [
		'bye',
		'goodbye',
		'see you',
		'see ya',
		'cya',
		'ttyl',
		'talk to you later',
		'talk to you soon',
	],
	FAREWELL_WORDS_RESPONSE: `GOODBYE!`,
	APPRECIATION_WORDS: [
		'thank you',
		'thanks',
		'thx',
		'ty',
		'appreciate it',
	],
	APPRECIATION_WORDS_RESPONSE: `YOU'RE WELCOME!`,
	INQUIRY_WORDS: [
		'who',
		'who are you',
		'what is your name',
		'what do you do',
	],
	INQUIRY_WORDS_RESPONSE: `I'M HELP NINJA, YOUR PERSONAL SHOPPING ASSISTANT`,
	HELP_WORDS: [
		'help',
		'support',
		'assistance',
		'assist',
		'help me',
		'help me with',
		'help me with my',
		'help me with my order',
		'help me with my cart',
		'help me with my purchase',
		'help me with my payment',
	],
	HELP_WORDS_RESPONSE: `I CAN HELP YOU WITH THE FOLLOWING:`,

	//SHOPPING
	ERROR_RESPONSE:
		'Sorry, I did not understand, Help me understand by choosing from the following options:',
	CHECKOUT_ORDER: '99',
	CHECKOUT_ORDER_RESPONSE: 'Thank you for shopping with us.',
	ORDER_HISTORY: '98',
	ORDER_HISTORY_RESPONSE: 'Your Order History is as follows:',
	CURRENT_ORDER: '97',
	CURRENT_ORDER_RESPONSE: 'Your Current Order is as follows:',
	VIEW_SHOP_ITEMS: '96',
	VIEW_SHOP_ITEMS_RESPONSE: 'You can shop for the following items:',
	CANCEL_ORDER: '0',
	CANCEL_ORDER_RESPONSE:
		'Your order has been cancelled. Thank you for shopping with us. </br> Would you like to shop again?',

	GO_TO_CART_PAGE:
		"Click on the 'Cart' button 👇🏼 to view your cart and adjust your order",
	//DISPLAY ITEMS
	USER_SHOPPING_OPTIONS: [
		'Press 99. To checkout order',
		'Press 98. To view Order History',
		'Press 97. To view Current Order ',
		'Press 96. To view Shop Items',
		'Press 90. To clear your cart',
		'Press 0. To cancel order',
	],
};
