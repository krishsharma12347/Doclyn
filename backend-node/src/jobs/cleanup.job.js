const cron = require('node-cron');
const jobsService = require('../modules/jobs/jobs.service');
const { StorageManager } = require('../utils/storage');
const { connectPostgres } = require('../config/db.postgres');
const logger = require('../utils/logger');

let dbPool;

const initCleanupJob = async () => {
  try {
    dbPool = await connectPostgres();
    logger.info('Cleanup job initialized');
  } catch (error) {
    logger.error('Failed to initialize cleanup job:', error);
  }
};

const cleanupOldFiles = async () => {
  if (!dbPool) {
    logger.warn('Database not initialized for cleanup job');
    return;
  }
  
  try {
    // Clean up files older than 24 hours
    const fileResult = await dbPool.query(
      `SELECT id, path FROM files WHERE created_at < NOW() - INTERVAL '24 hours'`
    );
    
    const storage = new StorageManager();
    let filesDeleted = 0;
    let filesFailed = 0;
    
    for (const file of fileResult.rows) {
      try {
        await storage.deleteFile(file.path);
        await dbPool.query('DELETE FROM files WHERE id = $1', [file.id]);
        filesDeleted++;
      } catch (error) {
        logger.warn(`Failed to delete file ${file.id}:`, error.message);
        filesFailed++;
      }
    }
    
    // Clean up job records older than 24 hours (done/failed only)
    const jobResult = await jobsService.cleanupOldJobs(24);
    
    logger.info(`Cleanup completed: ${filesDeleted} files deleted, ${filesFailed} failed, ${jobResult} job records removed`);
  } catch (error) {
    logger.error('Cleanup job error:', error);
  }
};

// Schedule to run every hour
cron.schedule('0 * * * *', cleanupOldFiles, {
  timezone: 'UTC'
});

module.exports = { initCleanupJob };