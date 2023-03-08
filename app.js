const express = require('express');
const { appConfig, Logger } = require('./config');
const app = express();

global.logger = Logger.createLogger({ label: 'HELP NINJA BOT' });

appConfig(app);

module.exports = app;
