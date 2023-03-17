const axios = require('axios');

/**
 * @class StoreService
 * @description StoreService class
 * @exports StoreService
 * @classdesc StoreService class
 */

class StoreService {
	/**
	 * @static
	 * @function getStore - gets the store details
	 * @param {string} storeId
	 * @memberof StoreService
	 * @returns {object} store - returns store details
	 */
	static async getStoreItems() {
		const store = await axios.get(
			`https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood`,
		);
		return store.data;
	}
}

module.exports = StoreService;
