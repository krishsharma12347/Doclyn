/**
 * Files HTTP layer.
 * Translates req/res into service calls.
 */
const service = require('./files.service');
const storage = require('../../utils/storage'); // FIX: was missing, download() below needs it
const { validateUuid } = require('./files.validator');

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

const upload = asyncHandler(async (req, res) => {
  // FIX: the route uses multer's `upload.single('file')`, which puts the
  // uploaded file on `req.file` (singular object), NOT `req.files.file`.
  // The old code always read `req.files.file`, which is always undefined
  // with single-file uploads, so every upload failed with "No file provided".
  const file = req.file || null;
  const result = await service.upload({ file, ownerId: req.user.id });
  return res.status(201).json({
    success: true,
    data: result,
    message: 'File uploaded successfully',
  });
});

const download = asyncHandler(async (req, res) => {
  const { file_id } = req.params;
  validateUuid(file_id);
  const { fullPath, originalName } = await service.download({
    fileId: file_id,
    ownerId: req.user.id,
  });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${originalName}"`);
  storage.streamFile(fullPath, res);
});

const list = asyncHandler(async (req, res) => {
  const files = await service.list({ ownerId: req.user.id });
  return res.status(200).json({
    success: true,
    data: files,
    message: 'Files fetched successfully',
  });
});

const remove = asyncHandler(async (req, res) => {
  const { file_id } = req.params;
  validateUuid(file_id);
  await service.remove({ fileId: file_id, ownerId: req.user.id });
  return res.status(200).json({
    success: true,
    data: null,
    message: 'File deleted successfully',
  });
});

module.exports = { upload, download, list, remove };