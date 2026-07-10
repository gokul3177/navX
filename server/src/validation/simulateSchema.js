/**
 * @file simulateSchema.js
 * @description express-validator rules for the POST /api/simulate endpoint.
 * Validates grid coordinates, algorithm choice, and obstacle format.
 */

const { body } = require('express-validator');

const VALID_ALGORITHMS = ['BFS', 'DFS', 'DIJKSTRA', 'ASTAR'];
const MAX_GRID_SIZE = 50;

/**
 * Helper — validates that a value is a [row, col] array with valid bounds.
 */
function isValidCoordinate(value, gridSize) {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    Number.isInteger(value[0]) &&
    Number.isInteger(value[1]) &&
    value[0] >= 0 &&
    value[1] >= 0 &&
    value[0] < gridSize &&
    value[1] < gridSize
  );
}

const simulateSchema = [
  body('algorithm')
    .isIn(VALID_ALGORITHMS)
    .withMessage(`Algorithm must be one of: ${VALID_ALGORITHMS.join(', ')}`),

  body('gridSize')
    .isInt({ min: 5, max: MAX_GRID_SIZE })
    .withMessage(`Grid size must be between 5 and ${MAX_GRID_SIZE}`),

  body('start')
    .isArray({ min: 2, max: 2 })
    .withMessage('Start must be a [row, col] array')
    .custom((value, { req }) => {
      if (!isValidCoordinate(value, req.body.gridSize)) {
        throw new Error('Start coordinate is out of grid bounds');
      }
      return true;
    }),

  body('goal')
    .isArray({ min: 2, max: 2 })
    .withMessage('Goal must be a [row, col] array')
    .custom((value, { req }) => {
      if (!isValidCoordinate(value, req.body.gridSize)) {
        throw new Error('Goal coordinate is out of grid bounds');
      }
      return true;
    }),

  body('obstacles')
    .isArray()
    .withMessage('Obstacles must be an array')
    .custom((obstacles, { req }) => {
      for (const obs of obstacles) {
        if (!isValidCoordinate(obs, req.body.gridSize)) {
          throw new Error(`Invalid obstacle coordinate: ${JSON.stringify(obs)}`);
        }
      }
      if (obstacles.length > req.body.gridSize * req.body.gridSize * 0.7) {
        throw new Error('Too many obstacles — grid would be unsolvable');
      }
      return true;
    }),
];

module.exports = { simulateSchema };
