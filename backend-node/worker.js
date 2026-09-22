require('dotenv').config();

const connectMongo = require('./src/config/db.mongo');
const { connectRedis } = require('./src/config/redis');
const { initCleanupJob } = require('./src/jobs/cleanup.job');
const toolJobProcessor = require('./src/queue/processors/toolJob.processor');
const toolQueue = require('./src/config/bull.config');

const startWorker = async () => {
  try {
    console.log('Starting Doclyn Worker...');

    // Connect MongoDB
    await connectMongo();

    // Connect Redis
    await connectRedis();

    // Initialize cleanup job
    await initCleanupJob();

    // Register Bull processor
    toolQueue.process('processToolJob', toolJobProcessor);

    console.log('Worker started successfully');
    console.log('Waiting for jobs...');
  } catch (error) {
    console.error('Failed to start worker:', error.message);
    process.exit(1);
  }
};

startWorker();

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down worker...`);

  try {
    await toolQueue.close();

    console.log('Worker shut down successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error during worker shutdown:', error);

    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));