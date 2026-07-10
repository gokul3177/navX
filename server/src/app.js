/**
 * @file app.js
 * @description Express application factory.
 * Registers all middleware and routes. Separated from server.js
 * to allow clean testing without starting the HTTP server.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { config } = require('./config/env');
const apiRouter = require('./routes/index');
const { errorHandler } = require('./middlewares/errorHandler');
const { apiLimiter } = require('./middlewares/rateLimiter');
const logger = require('./utils/logger');

const app = express();

// ── Security Headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (config.cors.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    logger.warn(`CORS blocked origin: ${origin}`);
    return callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Request Logging ──────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  logger.debug(`→ ${req.method} ${req.path}`);
  next();
});

// ── Rate Limiting ─────────────────────────────────────────────────────────────
app.use('/api', apiLimiter);

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api', apiRouter);

// ── Root Route ────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    name: 'NavX API',
    version: '2.0.0',
    docs: '/api/health',
    endpoints: [
      'GET  /api/health',
      'GET  /api/algorithms',
      'POST /api/simulate',
      'GET  /api/history',
      'GET  /api/history/stats',
      'POST /api/maze',
    ],
  });
});

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Centralized Error Handler (must be last) ──────────────────────────────────
app.use(errorHandler);

module.exports = app;
