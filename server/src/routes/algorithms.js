/**
 * @file algorithms.js
 * @description Routes for GET /api/algorithms
 */

const express = require('express');
const router = express.Router();
const { getAlgorithms } = require('../controllers/algorithmController');

router.get('/', getAlgorithms);

module.exports = router;
