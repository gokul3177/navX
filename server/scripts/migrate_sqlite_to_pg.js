/**
 * @file migrate_sqlite_to_pg.js
 * @description Script to migrate data from local navx.sqlite to PostgreSQL
 */

const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const SQLITE_PATH = path.resolve(__dirname, '../../navx.sqlite');
const PG_URL = process.env.DATABASE_URL;

async function migrate() {
  if (!fs.existsSync(SQLITE_PATH)) {
    console.log('No local SQLite database found. Nothing to migrate.');
    return;
  }

  if (!PG_URL) {
    console.error('DATABASE_URL is not set in .env! Cannot migrate to PostgreSQL.');
    process.exit(1);
  }

  console.log('Connecting to PostgreSQL...');
  const pgPool = new Pool({
    connectionString: PG_URL,
    ssl: { rejectUnauthorized: false }
  });

  console.log('Applying PostgreSQL schema...');
  const schemaSql = fs.readFileSync(path.resolve(__dirname, 'schema.sql'), 'utf-8');
  await pgPool.query(schemaSql);
  console.log('Schema applied successfully.');

  console.log(`Connecting to SQLite at ${SQLITE_PATH}...`);
  const sqliteDb = await open({
    filename: SQLITE_PATH,
    driver: sqlite3.Database
  });

  const rows = await sqliteDb.all('SELECT * FROM simulations ORDER BY id ASC');
  console.log(`Found ${rows.length} records in SQLite.`);

  if (rows.length === 0) {
    console.log('No records to migrate. Done.');
    process.exit(0);
  }

  console.log('Starting migration...');
  
  for (const row of rows) {
    const insertSql = `
      INSERT INTO simulations
        (algorithm, grid_size, start_point, goal_point, obstacles, path, visited_count, path_length, time_taken, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;

    // SQLite stored JSON as strings. PostgreSQL JSONB takes objects/strings, but pg pool string arrays work.
    // However, if we parse it, we must stringify it again or pass as JSON.
    // Since it's already stringified in SQLite, passing it as a string to PostgreSQL JSONB works natively.
    await pgPool.query(insertSql, [
      row.algorithm,
      row.grid_size,
      row.start_point,
      row.goal_point,
      row.obstacles,
      row.path,
      row.visited_count,
      row.path_length,
      row.time_taken,
      row.created_at
    ]);
  }

  console.log(`✅ Successfully migrated ${rows.length} records to PostgreSQL!`);
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
