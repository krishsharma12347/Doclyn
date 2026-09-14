const Job = require('./jobs.model');

class JobsService {
  async createJob(jobData) {
    const job = new Job(jobData);
    return await job.save();
  }

  async getJobById(jobId) {
    return await Job.findOne({ job_id: jobId });
  }

  async updateJobStatus(jobId, status, additionalData = {}) {
    const updateData = {
      status,
      ...additionalData
    };
    
    if (status === 'processing') {
      updateData.started_at = new Date();
    }
    
    if (status === 'done' || status === 'failed') {
      updateData.completed_at = new Date();
    }
    
    return await Job.findOneAndUpdate(
      { job_id: jobId },
      { $set: updateData },
      { new: true }
    );
  }

  async incrementRetryCount(jobId) {
    return await Job.findOneAndUpdate(
      { job_id: jobId },
      { $inc: { retry_count: 1 } },
      { new: true }
    );
  }

  async cleanupOldJobs(hours = 24) {
    const cutoffDate = new Date(Date.now() - hours * 60 * 60 * 1000);
    const result = await Job.deleteMany({
      created_at: { $lt: cutoffDate },
      status: { $in: ['done', 'failed'] }
    });
    return result.deletedCount;
  }
}

module.exports = new JobsService();