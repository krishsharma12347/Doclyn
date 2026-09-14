const toolQueue = require('../config/bull.config');
const jobsService = require('../modules/jobs/jobs.service');

const addToolJob = async (jobData) => {
  const jobRecord = await jobsService.createJob({
    job_id: jobData.job_id,
    user_id: jobData.user_id,
    tool_type: jobData.tool_type,
    input_files: jobData.input_files,
    options: jobData.options || {}
  });
  
  await toolQueue.add('processToolJob', jobData, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  });
  
  return jobRecord;
};

module.exports = { addToolJob };