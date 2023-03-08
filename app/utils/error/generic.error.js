const ApiError = require('./api.error');
const constants = require('../constants');

const { API_NOT_FOUND } = constants;

module.exports = {
	notFoundApi: new ApiError({
		status: 404,
		message: API_NOT_FOUND,
	}),
};
