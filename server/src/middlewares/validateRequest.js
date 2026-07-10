/**
 * @file validateRequest.js
 * @description Input validation middleware using express-validator.
 * Collects all validation errors and returns them in a single response
 * rather than failing on the first error.
 */

const { validationResult } = require('express-validator');

/**
 * Middleware that runs after express-validator chains.
 * If validation errors exist, returns 400 with the error details.
 */
function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  return next();
}

module.exports = { validateRequest };
