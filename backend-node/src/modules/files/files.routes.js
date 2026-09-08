/**
 * Files routes.
 * All are protected — auth middleware required.
 */
const express = require('express');
const multer = require('multer');
const controller = require('./files.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = express.Router();

// multer with memoryStorage so we get req.files.file.buffer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB per file
});

router.post('/upload', authMiddleware, upload.single('file'), controller.upload);
router.get('/list', authMiddleware, controller.list);
router.get('/:file_id/download', authMiddleware, controller.download);
router.delete('/:file_id', authMiddleware, controller.remove);

module.exports = router;