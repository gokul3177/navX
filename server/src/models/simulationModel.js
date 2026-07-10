/**
 * @file simulationModel.js
 * @description Database query functions for the simulations table.
 * All queries use parameterized statements to prevent SQL injection.
 * Returns plain data objects — business logic lives in services.
 */

const { pool } = require('../config/database');

/**
 * Inserts a new simulation result into the database.
 * @param {Object} simulation - The simulation data to insert
 * @returns {Promise<number>} The inserted row's ID
 */
async function createSimulation(simulation) {
  const {
    algorithm,
    gridSize,
    start,
    goal,
    obstacles,
    path,
    visitedCount,
    pathLength,
    timeTaken,
  } = simulation;

  const sql = `
    INSERT INTO simulations
      (algorithm, grid_size, start_point, goal_point, obstacles, path, visited_count, path_length, time_taken)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id
  `;

  const [rows] = await pool.execute(sql, [
    algorithm,
    gridSize,
    JSON.stringify(start),
    JSON.stringify(goal),
    JSON.stringify(obstacles),
    JSON.stringify(path),
    visitedCount,
    pathLength,
    timeTaken,
  ]);

  return rows[0].id;
}

/**
 * Fetches paginated simulation history with optional algorithm filter.
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of results per page
 * @param {number} options.offset - Offset for pagination
 * @param {string|null} options.algorithm - Filter by algorithm (optional)
 * @returns {Promise<Array>} Array of simulation records
 */
async function getSimulations({ limit = 10, offset = 0, algorithm = null } = {}) {
  let sql = `
    SELECT id, algorithm, grid_size, start_point, goal_point,
           visited_count, path_length, time_taken, created_at
    FROM simulations
  `;
  const params = [];
  let paramIdx = 1;

  if (algorithm) {
    sql += ` WHERE algorithm = $${paramIdx++}`;
    params.push(algorithm.toUpperCase());
  }

  sql += ` ORDER BY created_at DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
  params.push(limit, offset);

  const [rows] = await pool.execute(sql, params);
  return rows;
}

/**
 * Gets the total count of simulations for pagination metadata.
 * @param {string|null} algorithm - Filter by algorithm (optional)
 * @returns {Promise<number>} Total count
 */
async function countSimulations(algorithm = null) {
  let sql = 'SELECT COUNT(*) AS total FROM simulations';
  const params = [];

  if (algorithm) {
    sql += ' WHERE algorithm = $1';
    params.push(algorithm.toUpperCase());
  }

  const [rows] = await pool.execute(sql, params);
  // PostgreSQL returns COUNT(*) as string, need to cast it
  return parseInt(rows[0].total, 10);
}

/**
 * Fetches aggregate statistics per algorithm.
 * @returns {Promise<Array>} Stats grouped by algorithm
 */
async function getAlgorithmStats() {
  const sql = `
    SELECT
      algorithm,
      COUNT(*) AS total_runs,
      AVG(path_length) AS avg_path_length,
      AVG(visited_count) AS avg_nodes_explored,
      AVG(time_taken) AS avg_time_taken,
      MIN(time_taken) AS min_time_taken,
      MAX(time_taken) AS max_time_taken
    FROM simulations
    GROUP BY algorithm
    ORDER BY algorithm
  `;
  const [rows] = await pool.execute(sql);
  return rows.map(row => ({
    algorithm: row.algorithm,
    total_runs: parseInt(row.total_runs, 10),
    avg_path_length: parseFloat(row.avg_path_length),
    avg_nodes_explored: parseFloat(row.avg_nodes_explored),
    avg_time_taken: parseFloat(row.avg_time_taken),
    min_time_taken: parseFloat(row.min_time_taken),
    max_time_taken: parseFloat(row.max_time_taken)
  }));
}

module.exports = { createSimulation, getSimulations, countSimulations, getAlgorithmStats };
