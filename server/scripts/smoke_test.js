require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function test() {
  // Test INSERT
  const r1 = await pool.query(
    'INSERT INTO simulations (algorithm, grid_size, start_point, goal_point, obstacles, path, visited_count, path_length, time_taken) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id',
    ['BFS', 20, '[0,0]', '[19,19]', '[]', '[[0,0],[1,0]]', 42, 38, 12.5]
  );
  console.log('✅ INSERT OK - id:', r1.rows[0].id);

  // Test SELECT
  const r2 = await pool.query('SELECT id, algorithm, visited_count FROM simulations ORDER BY created_at DESC LIMIT 5');
  console.log('✅ SELECT OK - rows:', JSON.stringify(r2.rows));

  // Test COUNT
  const r3 = await pool.query('SELECT COUNT(*) AS total FROM simulations');
  console.log('✅ COUNT OK - total:', r3.rows[0].total);

  // Test STATS
  const r4 = await pool.query('SELECT algorithm, COUNT(*) as runs, AVG(path_length) as avg_path FROM simulations GROUP BY algorithm');
  console.log('✅ STATS OK:', JSON.stringify(r4.rows));

  await pool.end();
  process.exit(0);
}

test().catch(e => {
  console.error('❌ FAIL:', e.message);
  process.exit(1);
});
