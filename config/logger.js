const root = require('app-root-path');
const winston = require('winston');

const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf, json, colorize } = format;
const { Timer } = transports;

const logFormat = printf(({ level, message, label, timestamp }) => {
	return `${timestamp} ${level} : ${message}`;
});

const getLogToProcess = (fileOpt, consoleOpt) => {
	const logArray = [];

	logArray.push(
		new winston.transports.File(fileOpt),
		new winston.transports.Console(consoleOpt),
	);

	return logArray;
};

/**
 * Used to log events in the apps lifecycle
 * @class Logger
 */

class Logger {
	/**
	 * Creates a new instance of logger
	 * @param { Object } options - contains configuration parameters.
	 * @param { String } options.logDirPath - Path to the log folder,
	 * the default directory is logs (optional).
	 * @param { String } options.label - A name used to describe the context of the log generated.
	 * the default label is "Log"
	 * @returns { Logger } - An instance of logger.
	 * @constructor Logger
	 */
	constructor(options) {
		this.logDirPath = options.logDirPath || `${root}/logs`;
		this.label = options.label || 'Log';
		// this.startTime = Timer();

		this._logOptions = {
			console: {
				level: 'debug',
				handleExceptions: true,
				handleRejections: true,
				format: combine(
					colorize({ all: true }),
					printf(
						(msg) =>
							`[${new Date(msg.timestamp).toUTCString()}]: ${
								msg.label
							} : - ${msg.level}: ${msg.message}`,
					),
				),
			},
			file: {
				level: 'debug',
				filename: `${this.logDir}/app.log`,
				handleRejections: true,
				maxsize: 5242880,
				maxFiles: 2000,
				format: json(),
			},
		};
	}

	/**
	 * Logs all transactions during the app lifecycle
	 * @memberof Logger
	 */
	_logTransports() {
		const { console, file } = this._logOptions;
		const fileOpt = {
			...file,
			filename: `${this.logDirPath}/app.${this.environment}.log`,
		};
		const logProcess = getLogToProcess(fileOpt, console);
		return logProcess;
	}

	/**
	 * Initiates a new logger
	 * @private
	 * @returns { Object } A new logger instance
	 * @memberof Logger
	 */
	Init() {
		const logger = createLogger({
			format: combine(
				timestamp(),
				label({
					label: this.label,
				}),
			),
			transports: this._logTransports(),
			exitOnError: false,
		});

		logger.stream = {
			write(message) {
				logger.info(message);
			},
		};

		return logger;
	}

	/**
	 * Creates a new instance of the winston Logger with the specified configuration.
	 * @static
	 * @param { Object }  options - contains configuration parameters.
	 * @memberof Logger
	 * @returns { Object } - An instance of logger
	 */
	static createLogger(options) {
		const loggerInstance = new Logger(options);

		return loggerInstance.Init();
	}
}

module.exports = Logger;
