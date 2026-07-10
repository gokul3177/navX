/**
 * @file historyController.js
 * @description Handles GET /api/history and GET /api/history/stats requests.
 */

const { getSimulations, countSimulations, getAlgorithmStats } = require('../models/simulationModel');
const { sendSuccess } = require('../utils/responseHelper');
const { AppError } = require('../middlewares/errorHandler');
const logger = require('../utils/logger');

/**
 * GET /api/history
 * Returns paginated simulation history with optional algorithm filter.
 * Query params: ?page=1&limit=10&algorithm=BFS
 */
async function getHistory(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const algorithm = req.query.algorithm || null;
    const offset = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      getSimulations({ limit, offset, algorithm }),
      countSimulations(algorithm),
    ]);

    return sendSuccess(res, {
      results: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    logger.error(`History fetch error: ${error.message}`);
    return next(new AppError('Failed to fetch simulation history', 500));
  }
}

/**
 * GET /api/history/stats
 * Returns aggregate statistics grouped by algorithm.
 */
async function getStats(req, res, next) {
  try {
    const stats = await getAlgorithmStats();
    return sendSuccess(res, { stats });
  } catch (error) {
    logger.error(`Stats fetch error: ${error.message}`);
    return next(new AppError('Failed to fetch statistics', 500));
  }
}

module.exports = { getHistory, getStats };
