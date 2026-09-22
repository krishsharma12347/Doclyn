const Queue = require('bull');

const toolQueue = new Queue('toolJobs', {
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  },
});

toolQueue.on('failed', (job, error) => {
  console.error(`Job ${job.id} failed: ${error.message}`);
});

toolQueue.on('error', (error) => {
  console.error('Bull Queue Error:', error);
});

module.exports = toolQueue;