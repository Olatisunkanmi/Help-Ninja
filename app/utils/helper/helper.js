const constants = require('../constants');

const { FAIL, SUCCESS } = constants;

/**
 * A collection of helper methods used throughout app lifecycle
 * @class
 */

class Helper {
	/**
	 * Generates a JSON response for failure scenarios.
	 * @static
	 * @param {Request} req - Request object.
	 * @param {Response} res - Response object.
	 * @param {object} error - The error object.
	 * @param {number} error.status -  HTTP Status code, default is 500.
	 * @param {string} error.message -  Error message.
	 * @param {object|array} error.errors -  A collection of  error message.
	 * @memberof Helper
	 * @returns {JSON} - A JSON server response.
	 */

	static errorResponse(req, res, error) {
		const aggregateError = { ...error };
		return res.status(aggregateError.status).json({
			status: FAIL,
			message: aggregateError.message,
			errors: aggregateError.errors,
		});
	}

	/**
	 * Generates a JSON response for success scenarios.
	 * @static
	 * @param {Response} res - Response object.
	 * @param {object} options - An object containing response properties.
	 * @param {object} options.data - The payload.
	 * @param {string} options.message -  HTTP Status code.
	 * @param {number} options.code -  HTTP Status code.
	 * @memberof Helper
	 * @returns {JSON} - A JSON success response.
	 */
	static successResponse(
		res,
		{ data, message = SUCCESS_RESPONSE, code = 200 },
	) {
		return res.status(code).json({
			status: SUCCESS,
			message,
			data,
		});
	}
}

module.exports = Helper;
