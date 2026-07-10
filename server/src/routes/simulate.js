/**
 * @file simulate.js
 * @description Routes for POST /api/simulate
 */

const express = require('express');
const router = express.Router();
const { simulate } = require('../controllers/simulateController');
const { simulateLimiter } = require('../middlewares/rateLimiter');
const { simulateSchema } = require('../validation/simulateSchema');
const { validateRequest } = require('../middlewares/validateRequest');

router.post('/', simulateLimiter, simulateSchema, validateRequest, simulate);

module.exports = router;
