/**
 * @file logger.js
 * @description Lightweight structured logger. Production-safe —
 * avoids leaking sensitive data while providing useful context.
 */

const { config } = require('../config/env');

const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const CURRENT_LEVEL = config.isProduction ? LOG_LEVELS.info : LOG_LEVELS.debug;

function formatMessage(level, message) {
  const ts = new Date().toISOString();
  return `[${ts}] [${level.toUpperCase()}] ${message}`;
}

const logger = {
  error: (msg) => LOG_LEVELS.error <= CURRENT_LEVEL && console.error(formatMessage('error', msg)),
  warn:  (msg) => LOG_LEVELS.warn  <= CURRENT_LEVEL && console.warn(formatMessage('warn', msg)),
  info:  (msg) => LOG_LEVELS.info  <= CURRENT_LEVEL && console.log(formatMessage('info', msg)),
  debug: (msg) => LOG_LEVELS.debug <= CURRENT_LEVEL && console.log(formatMessage('debug', msg)),
};

module.exports = logger;
