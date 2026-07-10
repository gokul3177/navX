/**
 * @file healthController.js
 * @description Health check endpoint for uptime monitoring and deployment verification.
 * Render and other hosting platforms ping this to determine if the service is healthy.
 */

const { pool } = require('../config/database');
const { sendSuccess } = require('../utils/responseHelper');
const logger = require('../utils/logger');

const START_TIME = Date.now();

/**
 * GET /api/health
 * Returns server status, uptime, and database connectivity.
 */
async function healthCheck(req, res) {
  const uptime = Math.floor((Date.now() - START_TIME) / 1000);
  let dbStatus = 'unknown';

  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    dbStatus = 'connected';
  } catch {
    dbStatus = 'disconnected';
    logger.warn('Health check: database unreachable');
  }

  const status = dbStatus === 'connected' ? 'healthy' : 'degraded';
  const httpStatus = status === 'healthy' ? 200 : 503;

  return res.status(httpStatus).json({
    success: true,
    status,
    version: process.env.npm_package_version || '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: `${uptime}s`,
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
}

module.exports = { healthCheck };
