/**
 * @file simulateController.js
 * @description Handles POST /api/simulate requests.
 * Orchestrates: run algorithm → record timing → persist to DB → return result.
 */

const { runAlgorithm } = require('../services/pathfindingService');
const { createSimulation } = require('../models/simulationModel');
const { sendSuccess } = require('../utils/responseHelper');
const { AppError } = require('../middlewares/errorHandler');
const logger = require('../utils/logger');

/**
 * POST /api/simulate
 * Runs the selected pathfinding algorithm and saves the result.
 */
async function simulate(req, res, next) {
  try {
    const { algorithm, gridSize, start, goal, obstacles } = req.body;

    logger.info(`Simulation: ${algorithm} | Grid: ${gridSize}x${gridSize} | Start: ${JSON.stringify(start)} | Goal: ${JSON.stringify(goal)}`);

    const startTime = process.hrtime.bigint();
    const result = runAlgorithm(algorithm, start, goal, obstacles, gridSize);
    const endTime = process.hrtime.bigint();

    // Convert nanoseconds to seconds with 6 decimal precision
    const timeTaken = Number(endTime - startTime) / 1e9;

    const simulationData = {
      algorithm: algorithm.toUpperCase(),
      gridSize,
      start,
      goal,
      obstacles,
      path: result.path,
      visitedCount: result.nodesExplored,
      pathLength: result.path.length,
      timeTaken,
    };

    const insertId = await createSimulation(simulationData);

    return sendSuccess(res, {
      id: insertId,
      algorithm: algorithm.toUpperCase(),
      path: result.path,
      visited: result.visited,
      nodesExplored: result.nodesExplored,
      pathLength: result.path.length,
      timeTaken,
      found: result.path.length > 0,
    }, 'Simulation completed successfully', 201);
  } catch (error) {
    logger.error(`Simulation error: ${error.message}`);
    return next(new AppError(`Simulation failed: ${error.message}`, 500));
  }
}

module.exports = { simulate };
