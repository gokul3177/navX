/**
 * @file errorHandler.js
 * @description Centralized error handling middleware.
 * Catches all errors thrown/passed via next(err) and maps them
 * to appropriate HTTP status codes with consistent response shapes.
 */

const logger = require('../utils/logger');

/**
 * Custom application error with status code support.
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Express error-handling middleware (must have 4 parameters).
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational
    ? err.message
    : 'An unexpected error occurred. Please try again.';

  logger.error(`[${req.method} ${req.path}] ${err.message}`);

  if (process.env.NODE_ENV !== 'production') {
    logger.debug(err.stack);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

module.exports = { errorHandler, AppError };
