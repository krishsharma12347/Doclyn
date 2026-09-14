const Queue = require('bull');

const toolQueue = new Queue('toolJobs', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || null
  }
});

toolQueue.process(async (job) => {
  // Actual processing logic will be in the processor file
  return Promise.resolve();
});

toolQueue.on('failed', (job, err) => {
  console.log(`Job ${job.id} failed: ${err.message}`);
});

module.exports = toolQueue;