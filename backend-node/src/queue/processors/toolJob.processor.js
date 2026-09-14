const axios = require('axios');
const jobsService = require('../../modules/jobs/jobs.service');
const { getRedisClient } = require('../../config/redis');
const { v4: uuidv4 } = require('uuid');

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

const processToolJob = async (job) => {
  const { job_id, user_id, tool_type, input_files, options } = job.data;
  
  try {
    // Update status to processing
    await jobsService.updateJobStatus(job_id, 'processing');
    
    // Prepare request to Python service
    let pythonEndpoint = '';
    let pythonPayload = {};
    
    switch (tool_type) {
      case 'merge':
        pythonEndpoint = '/merge';
        pythonPayload = { file_ids: input_files.map(f => f.file_id) };
        break;
      case 'split':
        pythonEndpoint = '/split';
        pythonPayload = { 
          file_id: input_files[0].file_id,
          ranges: options.ranges || '1-10' 
        };
        break;
      case 'compress':
        pythonEndpoint = '/compress';
        pythonPayload = { 
          file_id: input_files[0].file_id,
          quality: options.quality || 'medium' 
        };
        break;
      case 'convert_word_to_pdf':
        pythonEndpoint = '/convert/word-to-pdf';
        pythonPayload = { file_id: input_files[0].file_id };
        break;
      case 'convert_pdf_to_word':
        pythonEndpoint = '/convert/pdf-to-word';
        pythonPayload = { file_id: input_files[0].file_id };
        break;
      case 'convert_ppt_to_pdf':
        pythonEndpoint = '/convert/ppt-to-pdf';
        pythonPayload = { file_id: input_files[0].file_id };
        break;
      case 'convert_pdf_to_ppt':
        pythonEndpoint = '/convert/pdf-to-ppt';
        pythonPayload = { file_id: input_files[0].file_id };
        break;
      case 'convert_excel_to_pdf':
        pythonEndpoint = '/convert/excel-to-pdf';
        pythonPayload = { file_id: input_files[0].file_id };
        break;
      case 'convert_pdf_to_excel':
        pythonEndpoint = '/convert/pdf-to-excel';
        pythonPayload = { file_id: input_files[0].file_id };
        break;
      case 'convert_jpg_to_pdf':
        pythonEndpoint = '/convert/jpg-to-pdf';
        pythonPayload = { file_ids: input_files.map(f => f.file_id) };
        break;
      case 'convert_pdf_to_jpg':
        pythonEndpoint = '/convert/pdf-to-jpg';
        pythonPayload = { file_id: input_files[0].file_id };
        break;
      case 'convert_html_to_pdf':
        pythonEndpoint = '/convert/html-to-pdf';
        pythonPayload = { file_id: input_files[0].file_id };
        break;
      case 'convert_pdf_to_pdfa':
        pythonEndpoint = '/convert/pdf-to-pdfa';
        pythonPayload = { file_id: input_files[0].file_id };
        break;
      default:
        throw new Error(`Unknown tool type: ${tool_type}`);
    }
    
    // Call Python service
    const response = await axios.post(
      `${PYTHON_SERVICE_URL}${pythonEndpoint}`,
      pythonPayload,
      { timeout: 60000 } // 60 seconds timeout
    );
    
    // Update job with output files
    await jobsService.updateJobStatus(job_id, 'done', {
      output_files: response.data.output_files || []
    });
    
    return response.data;
  } catch (error) {
    console.error(`Job ${job_id} failed:`, error.message);
    
    // Increment retry count
    const job = await jobsService.getJobById(job_id);
    let shouldRetry = true;
    
    if (job && job.retry_count >= 2) {
      shouldRetry = false; // Max retries reached
    }
    
    if (shouldRetry) {
      await jobsService.incrementRetryCount(job_id);
      throw error; // Let Bull handle retry
    } else {
      // Mark as failed
      await jobsService.updateJobStatus(job_id, 'failed', {
        error_message: error.message || 'Unknown error occurred'
      });
      throw error;
    }
  }
};

module.exports = processToolJob;