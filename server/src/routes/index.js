/**
 * @file index.js
 * @description Central router — mounts all sub-routers under /api.
 * Adding a new feature only requires adding one line here.
 */

const express = require('express');
const router = express.Router();

const simulateRouter   = require('./simulate');
const historyRouter    = require('./history');
const algorithmsRouter = require('./algorithms');
const mazeRouter       = require('./maze');
const healthRouter     = require('./health');

router.use('/simulate',   simulateRouter);
router.use('/history',    historyRouter);
router.use('/algorithms', algorithmsRouter);
router.use('/maze',       mazeRouter);
router.use('/health',     healthRouter);

module.exports = router;
