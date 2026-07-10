/**
 * @file responseHelper.js
 * @description Standardizes API response shape across all endpoints.
 * Consistent response format makes the API predictable for consumers.
 */

/**
 * Send a successful response.
 * @param {Response} res - Express response object
 * @param {*} data - Payload to send
 * @param {string} [message='Success'] - Human-readable message
 * @param {number} [statusCode=200] - HTTP status code
 */
function sendSuccess(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Send an error response.
 * @param {Response} res - Express response object
 * @param {string} message - Human-readable error message
 * @param {number} [statusCode=500] - HTTP status code
 * @param {*} [details=null] - Optional error details (only in dev)
 */
function sendError(res, message, statusCode = 500, details = null) {
  const body = { success: false, message };
  if (process.env.NODE_ENV !== 'production' && details) {
    body.details = details;
  }
  return res.status(statusCode).json(body);
}

module.exports = { sendSuccess, sendError };
