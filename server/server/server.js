require('dotenv').config();
console.log('Loaded ENV:', process.env);
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// CORS for local + production frontend
app.use(cors({
  origin: ['http://localhost:3000', 'https://gokul3177.github.io'], 
  methods: ['GET', 'POST']
}));
app.use(express.json());

// ✅ Railway MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: parseInt(process.env.DB_PORT) || 3306,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// ✅ Test DB connection
db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL');
  }
});

// ✅ Save a simulation result
app.post('/save-path', (req, res) => {
  console.log("📦 Received path data:", req.body);

  const { algorithm, start, goal, obstacles, path, visitedCount, pathLength, timeTaken } = req.body;

  const sql = `
    INSERT INTO paths 
    (algorithm, start_point, goal_point, obstacles, path, visited_count, path_length, time_taken)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    algorithm,
    JSON.stringify(start),
    JSON.stringify(goal),
    JSON.stringify(obstacles),
    JSON.stringify(path),
    visitedCount,
    pathLength,
    timeTaken
  ], (err) => {
    if (err) {
      console.error('❌ Insert failed:', err);
      res.status(500).send('Insert failed');
    } else {
      res.send({ message: '✅ Saved successfully' });
    }
  });
});

// ✅ Get past results
app.get('/results', (req, res) => {
  const sql = `SELECT * FROM paths ORDER BY id DESC LIMIT 10`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error fetching results:', err);
      return res.status(500).send('Error fetching results');
    }
    res.json(results);
  });
});

// ✅ Default test route
app.get('/', (req, res) => {
  res.send('🎉 Backend is up and running!');
});

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
