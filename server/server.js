// Description: Backend server for pathfinding simulation using Node.js, Express, and MySQL.
require('dotenv').config();
console.log("🔍 Loaded .env:", {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? '✅ Set' : '❌ Not Set',
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
});
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// ✅ Allow requests from local and GitHub Pages frontend
app.use(cors({
  origin: ['http://localhost:3000', 'https://gokul3177.github.io'],
  methods: ['GET', 'POST'],
}));

app.use(express.json());

// ✅ MySQL connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: parseInt(process.env.DB_PORT) || 3306,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ✅ Connect to MySQL and log result
db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

// ✅ Root route to confirm server is running
app.get('/', (req, res) => {
  res.send('🎉 Backend is up and running!');
});

// ✅ Route to save pathfinding result
app.post('/save-path', (req, res) => {
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
      console.error('❌ Error saving result:', err.message);
      return res.status(500).json({ message: 'Insert failed' });
    }
    res.json({ message: '✅ Saved successfully' });
  });
});

// ✅ Route to fetch recent simulation results
app.get('/results', (req, res) => {
  const sql = `SELECT * FROM paths ORDER BY id DESC LIMIT 10`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error fetching results:', err.message);
      return res.status(500).json({ message: 'Error fetching results' });
    }
    res.json(results);
  });
});

// ✅ Start server on given port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
