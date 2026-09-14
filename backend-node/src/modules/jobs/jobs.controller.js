const asyncHandler = require('express-async-handler');
const jobsService = require('./jobs.service');

const getJobStatus = asyncHandler(async (req, res) => {
  const job = await jobsService.getJobById(req.params.job_id);
  
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  
  res.json({
    status: job.status,
    progress: null, // We don't track progress in this implementation
    output_files: job.output_files,
    error_message: job.error_message
  });
});

const downloadJobOutput = asyncHandler(async (req, res) => {
  const job = await jobsService.getJobById(req.params.job_id);
  
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  
  if (job.status !== 'done') {
    res.status(400);
    throw new Error('Job is not completed');
  }
  
  // For simplicity, we'll return the first output file
  // In a real implementation, you might want to zip multiple files
  if (!job.output_files || job.output_files.length === 0) {
    res.status(404);
    throw new Error('No output files found');
  }
  
  const outputFile = job.output_files[0];
  const filePath = outputFile.path;
  
  // Check if file exists
  const fs = require('fs');
  if (!fs.existsSync(filePath)) {
    res.status(404);
    throw new Error('Output file not found on disk');
  }
  
  res.download(filePath, outputFile.original_name);
});

module.exports = {
  getJobStatus,
  downloadJobOutput
};