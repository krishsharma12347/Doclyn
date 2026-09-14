require('dotenv').config();
const { connectMongo } = require('./src/config/db.mongo');
const { connectRedis } = require('./src/config/redis');
const jobsService = require('./src/modules/jobs/jobs.service');
const { initCleanupJob } = require('./src/jobs/cleanup.job');
const toolJobProcessor = require('./src/queue/processors/toolJob.processor');
const toolQueue = require('./src/config/bull.config');

const startWorker = async () => {
  try {
    // Connect to databases
    await connectMongo();
    await connectRedis();
    
    // Initialize cleanup job
    await initCleanupJob();
    
    // Set up the processor
    toolQueue.process('processToolJob', toolJobProcessor);
    
    console.log('Worker started successfully');
    console.log('Waiting for jobs...');
  } catch (error) {
    console.error('Failed to start worker:', error);
    process.exit(1);
  }
};

startWorker();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down worker...');
  await toolQueue.close();
  process.exit(0);
});