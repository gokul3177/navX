/**
 * @file history.js
 * @description Routes for GET /api/history and GET /api/history/stats
 */

const express = require('express');
const router = express.Router();
const { getHistory, getStats } = require('../controllers/historyController');

router.get('/', getHistory);
router.get('/stats', getStats);

module.exports = router;
