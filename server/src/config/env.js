/**
 * @file env.js
 * @description Validates required environment variables on startup.
 * Fails fast with a clear error message if any required var is missing,
 * preventing cryptic runtime failures deep inside the application.
 */

// Removed MySQL vars for local SQLite persistence
const REQUIRED_VARS = [];

function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `[NavX] ❌ Missing required environment variables: ${missing.join(', ')}\n` +
      `       Copy server/.env.example to server/.env and fill in the values.`
    );
    process.exit(1);
  }
}

const config = {
  port: parseInt(process.env.PORT, 10) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
      : ['http://localhost:3000'],
  },
  // DB config no longer needed for MySQL, but kept empty object for backward compatibility if any file checks it
  db: {}
};

module.exports = { validateEnv, config };
