const sessionController = (() => {
	const cartKey = 'cartItems';

	const _fetchCart = () => {
		const userCart = JSON.parse(localStorage.getItem(cartKey)) || [];
		return userCart;
	};

	return {
		_fetchCart,
	};
})();

/**************************SOCKET CONTROLLER  ************************************* */

const socketController = (() => {
	const socket = io('/checkout');

	socket.on('connection', (data) => {
		console.log('data Cart Socket');
	});

	return {
		getSocket: () => socket,
	};
})();

/**************************UI CONTROLLER  ************************************* */

const UIController = (() => {
	//Get DOM strings

	const DOMStrings = {
		cartItems: '.cart-Items',
		cartTotal: '.cart-Items__total',
		cartTotalPrice: '.cart-Items__total-price',
		cartTotalItems: '.cart-Items__total-items',
		cartTotalItemsNumber: '.cart-Items__total-items-number',
		cartTotalItemsPrice: '.cart-Items__total-items-price',
	};

	const displayCartItems = (cartItems) => {
		const cartItemsList = document.querySelector(
			DOMStrings.cartItems,
		);

		cartItems.forEach((item) => {
			//render cart items
			const htmlTemplate = `<div
            class="row mb-4 d-flex justify-content-between align-items-center"
        >
            <div class="col-md-2 col-lg-2 col-xl-2">    
            %image%
            </div>
            <div class="col-md-3 col-lg-3 col-xl-3">
                <h6 class="text-muted">%category%</h6>
                <h6 class="text-black mb-0">
                  %title%
                </h6>
            </div>
            <div
                class="col-md-3 col-lg-3 col-xl-2 d-flex"
            >
                <button class="btn btn-link px-2">
                    <i class="fas fa-minus"></i>
                </button>

                <input
                    id="form1"
                    min="0"
                    name="quantity"
                    value="1"
                    type="number"
                    class="form-control form-control-sm"
                />

                <button class="btn btn-link px-2">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div
                class="col-md-3 col-lg-2 col-xl-2 offset-lg-1"
            >
                <h6 class="mb-0">€ 44.00</h6>
            </div>
            <div
                class="col-md-1 col-lg-1 col-xl-1 text-end"
            >
                <a href="#!" class="text-muted"
                    ><i class="fas fa-times"></i
                ></a>
            </div>
        </div>`;

			const imgElement = document.createElement('img');
			imgElement.src = item.image;

			let newHtml = htmlTemplate.replace(
				'%image%',
				imgElement.outerHTML,
			);
			newHtml = newHtml.replace('%title%', item.title);
			newHtml = newHtml.replace('%description%', item.description);
			newHtml = newHtml.replace('%category%', item.category);

			//insert html into the DOM
			cartItemsList.insertAdjacentHTML('beforeend', newHtml);
		});
	};

	return {
		getInputs: () => ({
			cartThread: document.querySelector(DOMStrings.cartItems),
		}),

		appendCartItems: (cartItems) => displayCartItems(cartItems),
	};
})();

/**************************APP CONTROLLER  ************************************* */

const AppController = ((socketController, UIController) => {
	const socket = socketController.getSocket();
	const { _fetchCart } = sessionController;
	const { appendCartItems, getInputs } = UIController;

	const getCartItems = () => {
		const cartItems = _fetchCart();
		appendCartItems(cartItems);
	};

	return {
		init: () => {
			getCartItems();
		},
	};
})(socketController, UIController);

// window.addEventListener('load', AppController.init());

AppController.init();
