/**
 * Server entry point.
 * Loads env, connects to DB, starts HTTP server with graceful shutdown.
 */

require('dotenv').config();

const app = require('./app');
const logger = require('./utils/logger');
const db = require('./config/db.postgres');

const PORT = parseInt(process.env.PORT || '3000', 10);

async function start() {
  try {
    // Test DB connection
    await db.query('SELECT 1');

    logger.info('Database connected successfully');

    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(
        `Environment: ${process.env.NODE_ENV || 'development'}`
      );
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      logger.info(`${signal} received, shutting down gracefully`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await db.end();

          logger.info('Database connections closed');

          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown', {
            error: error.message,
            stack: error.stack,
          });

          process.exit(1);
        }
      });

      setTimeout(() => {
        logger.error('Forced shutdown after timeout');

        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('\n========== SERVER STARTUP ERROR ==========');
    console.error(error);
    console.error('==========================================\n');

    logger.error('Failed to start server', {
      error: error.message,
      stack: error.stack,
      code: error.code,
    });

    process.exit(1);
  }
}

start();







