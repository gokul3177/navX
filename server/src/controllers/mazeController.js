/**
 * @file mazeController.js
 * @description Handles POST /api/maze — generates a random solvable maze.
 */

const { generateMaze } = require('../services/mazeService');
const { sendSuccess } = require('../utils/responseHelper');
const { AppError } = require('../middlewares/errorHandler');
const logger = require('../utils/logger');

/**
 * POST /api/maze
 * Generates a random maze for the given grid size.
 * Body: { gridSize: number }
 */
async function getMaze(req, res, next) {
  try {
    const gridSize = parseInt(req.body.gridSize, 10) || 20;

    if (gridSize < 5 || gridSize > 50) {
      return next(new AppError('Grid size must be between 5 and 50', 400));
    }

    logger.info(`Generating maze for ${gridSize}x${gridSize} grid`);
    const { obstacles } = generateMaze(gridSize);

    return sendSuccess(res, {
      gridSize,
      obstacles,
      obstacleCount: obstacles.length,
    }, 'Maze generated successfully');
  } catch (error) {
    logger.error(`Maze generation error: ${error.message}`);
    return next(new AppError('Maze generation failed', 500));
  }
}

module.exports = { getMaze };
