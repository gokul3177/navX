/**
 * @file server.js
 * @description Application entry point — thin bootstrapper.
 * Loads environment variables, validates config, connects to DB, then starts HTTP server.
 */

require('dotenv').config();

const { validateEnv, config } = require('./src/config/env');
const { testConnection } = require('./src/config/database');
const app = require('./src/app');
const logger = require('./src/utils/logger');

// Validate required environment variables before anything else
validateEnv();

async function bootstrap() {
  // Test DB connection (non-fatal — server still starts)
  await testConnection();

  const server = app.listen(config.port, () => {
    logger.info(`🚀 NavX API running on port ${config.port} [${config.nodeEnv}]`);
    logger.info(`   Health check: http://localhost:${config.port}/api/health`);
  });

  // Graceful shutdown — close DB pool and stop accepting new connections
  const shutdown = (signal) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));

  // Catch unhandled promise rejections
  process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled rejection: ${reason}`);
  });
}

bootstrap();
