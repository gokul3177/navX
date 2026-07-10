/**
 * @file maze.js
 * @description Routes for POST /api/maze
 */

const express = require('express');
const router = express.Router();
const { getMaze } = require('../controllers/mazeController');

router.post('/', getMaze);

module.exports = router;
