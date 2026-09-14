const express = require('express');
const router = express.Router();
const { getJobStatus, downloadJobOutput } = require('./jobs.controller');
const { protect } = require('../auth/middleware/auth.middleware');

// All routes require authentication
router.use(protect);

router.get('/:job_id', getJobStatus);
router.get('/:job_id/download', downloadJobOutput);

module.exports = router;