/**
 * @file database.js
 * @description PostgreSQL database connection using pg pool.
 */

const { Pool } = require('pg');
const logger = require('../utils/logger');
const { DATABASE_URL, NODE_ENV } = require('./env');

if (!DATABASE_URL) {
  logger.warn('⚠️ No DATABASE_URL provided. Database connections will fail until configured.');
}

// Configure PostgreSQL pool
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// A wrapper to make pg.query behave slightly more like mysql2 for existing models.
const poolWrapper = {
  execute: async (sql, params) => {
    try {
      const res = await pool.query(sql, params);
      return [res.rows, res.fields];
    } catch (err) {
      logger.error('Database query error:', err);
      throw err;
    }
  },
  query: async (sql, params) => {
    const res = await pool.query(sql, params);
    return [res.rows, res.fields];
  }
};

async function testConnection() {
  if (!DATABASE_URL) return;
  try {
    const client = await pool.connect();
    logger.info('✅ Connected to PostgreSQL database successfully.');
    client.release();
  } catch (err) {
    logger.error('❌ Database connection failed:', err.message);
  }
}

module.exports = { pool: poolWrapper, testConnection, getClient: () => pool.connect() };
