/**
 * Files business logic. * Handles upload (save to disk + record in DB) and download (fetch + stream). */
const storage = require('../../utils/storage');
const model = require('./files.model');
const { HttpError } = require('../../middlewares/errorHandler.middleware');

const MAX_BYTES = parseInt(process.env.MAX_FILE_BYTES || '52428800', 10); // 50MB

function validatePdfFile(file) {
  if (!file) {
    throw new HttpError(400, 'No file provided. Use multipart field "file"');
  }
  if (file.mimetype !== 'application/pdf') {
    throw new HttpError(400, 'Only PDF files are allowed');
  }
  if (file.size > MAX_BYTES) {
    throw new HttpError(413, `File too large. Maximum allowed size is ${MAX_BYTES} bytes`);
  }
  if (file.size === 0) {
    throw new HttpError(400, 'File is empty');
  }
}

async function upload({ file, ownerId }) {
  validatePdfFile(file);

  const { fileId, fullPath } = storage.saveUpload(file.buffer, file.originalname);

  await model.createFile({
    id: fileId,
    ownerId,
    originalName: file.originalname,
    sizeBytes: file.size,
  });

  return {
    file_id: fileId,
    original_name: file.originalname,
    size_bytes: file.size,
  };
}

async function download({ fileId, ownerId }) {
  const record = await model.findFileById(fileId);
  if (!record) {
    throw new HttpError(404, 'File not found');
  }
  if (record.owner_id !== ownerId) {
    throw new HttpError(404, 'File not found');
  }
  const fullPath = storage.getUploadPath(fileId);
  return {
    fullPath,
    originalName: record.original_name,
    sizeBytes: record.size_bytes,
  };
}

async function list({ ownerId }) {
  const rows = await model.listFilesByOwner(ownerId);
  return rows.map((r) => ({
    file_id: r.id,
    original_name: r.original_name,
    size_bytes: r.size_bytes,
    created_at: r.created_at,
  }));
}

async function remove({ fileId, ownerId }) {
  const ok = await model.deleteFileById(fileId, ownerId);
  if (!ok) {
    throw new HttpError(404, 'File not found');
  }
  // Best-effort disk cleanup
  try {
    const fullPath = storage.getUploadPath(fileId);
    storage.removeIfExists(fullPath);
  } catch (e) {
    // ignore if file already gone
  }
  return { message: 'File deleted successfully' };
}

module.exports = {
  upload,
  download,
  list,
  remove,
};