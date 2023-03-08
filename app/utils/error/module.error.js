const constants = require('../constants');

const { MODULE_ERROR_STATUS, MODULE_ERROR } = constants;

/**
 * A custom Function method for handling errors
 * @class
 */
module.exports = class ModuleError extends Error {
	constructor(options) {
		super();

		Error.captureStackTrace(this, this.constructor);
		this.name = this.constructor.name;
		this.status = options.status || MODULE_ERROR_STATUS; //defualt error status  code
		this.message = options.message || MODULE_ERROR; // default error message
		if (options.errors) this.errors = options.errors;
	}
};
