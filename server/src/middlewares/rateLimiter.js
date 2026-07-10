/**
 * @file rateLimiter.js
 * @description Rate limiting middleware to protect the simulate endpoint
 * from abuse. Uses sliding window counter via express-rate-limit.
 */

const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter — 100 requests per 15 minutes per IP.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again in 15 minutes.',
  },
});

/**
 * Strict limiter for the simulate endpoint — 30 requests per minute.
 */
const simulateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Simulation rate limit exceeded. Please wait before running more simulations.',
  },
});

module.exports = { apiLimiter, simulateLimiter };
