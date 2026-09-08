/**
 * Tools business logic.
 * PDF manipulation (merge, split, compress) is delegated to the Python
 * FastAPI service. This service resolves file ownership, calls Python
 * with the exact shape it expects, and registers the output as a new
 * downloadable file.
 *
 * FIX (rewritten): the previous version posted multipart form-data with
 * `file_ids` to endpoints like `/tools/merge`. The actual Python service
 * (see organize.py / optimize.py) expects JSON bodies with real absolute
 * `input_paths` at `/organize/merge`, `/organize/split`, `/optimize/compress`
 * — a completely different shape and URL. It also used the wrong env var
 * name (PYTHON_SERVICE_URL instead of PYTHON_ENGINE_URL from .env.example),
 * and never checked that the requesting user actually owns the file_ids
 * they passed in.
 */
const fs = require('fs');
const axios = require('axios');

const { HttpError } = require('../../middlewares/errorHandler.middleware');
const logger = require('../../utils/logger');
const storage = require('../../utils/storage');
const filesModel = require('../files/files.model');

const PYTHON_BASE = process.env.PYTHON_ENGINE_URL || 'http://localhost:8001';

/**
 * Look up a file record and confirm the requesting user owns it, then
 * return its absolute path on disk. Throws 404 if missing or not owned
 * (same response either way, so we don't leak whether the ID exists).
 */
async function resolveOwnedFilePath(fileId, ownerId) {
  const record = await filesModel.findFileById(fileId);
  if (!record || record.owner_id !== ownerId) {
    throw new HttpError(404, `File not found: ${fileId}`);
  }
  return storage.getUploadPath(fileId);
}

/**
 * POST a JSON body to the Python service and return the parsed response.
 * Throws HttpError on failure so the Express error handler catches it.
 */
async function pythonPost(endpoint, body) {
  try {
    const response = await axios.post(`${PYTHON_BASE}${endpoint}`, body, {
      timeout: 120000,
    });
    return response.data;
  } catch (err) {
    if (err.response) {
      // Python's global handler returns {success, data, message} for
      // HTTPException, or {detail: "..."} if something bypassed it.
      const msg = err.response.data?.message || err.response.data?.detail || 'PDF processing failed';
      throw new HttpError(err.response.status || 500, msg);
    }
    if (err.code === 'ECONNREFUSED') {
      throw new HttpError(503, 'PDF processing service is unavailable');
    }
    logger.error('pythonPost error', { endpoint, error: err.message });
    throw new HttpError(502, 'Failed to reach PDF processing service');
  }
}

/**
 * Python writes its result to its own OUTPUT_DIR and gives us back an
 * absolute path + filename. We copy that file into OUR upload dir under
 * a fresh file_id and create a normal `files` row for it, so the existing
 * GET /files/:file_id/download route can serve it without any special-casing.
 *
 * This assumes Node and the Python service share a filesystem (true for
 * local dev and a single-VM deployment). If they're split across machines
 * later, swap this for an HTTP fetch of the output instead of fs.readFileSync.
 */
async function registerOutputAsFile(outputAbsolutePath, ownerId, displayName) {
  const buffer = fs.readFileSync(outputAbsolutePath);
  const { fileId } = storage.saveUpload(buffer, displayName);
  await filesModel.createFile({
    id: fileId,
    ownerId,
    originalName: displayName,
    sizeBytes: buffer.length,
  });
  return fileId;
}

async function merge({ fileIds, ownerId }) {
  if (!Array.isArray(fileIds) || fileIds.length < 2) {
    throw new HttpError(400, 'At least 2 file_ids required for merge');
  }

  const inputPaths = [];
  for (const id of fileIds) {
    inputPaths.push(await resolveOwnedFilePath(id, ownerId));
  }

  const result = await pythonPost('/organize/merge', { input_paths: inputPaths });
  const outputFileId = await registerOutputAsFile(result.output_path, ownerId, result.output_filename);

  return {
    output_file_id: outputFileId,
    output_file_name: result.output_filename,
  };
}

async function split({ fileId, pages, ownerId }) {
  if (!fileId) {
    throw new HttpError(400, 'file_id is required');
  }
  if (!pages || typeof pages !== 'string') {
    throw new HttpError(400, 'pages is required, e.g. "1-3,5"');
  }

  const inputPath = await resolveOwnedFilePath(fileId, ownerId);
  const result = await pythonPost('/organize/split', { input_path: inputPath, pages });
  const outputFileId = await registerOutputAsFile(result.output_path, ownerId, result.output_filename);

  return {
    output_file_id: outputFileId,
    output_file_name: result.output_filename,
  };
}

async function compress({ fileId, level, ownerId }) {
  if (!fileId) {
    throw new HttpError(400, 'file_id is required');
  }
  const compressionLevel = level || 'medium';
  if (!['low', 'medium', 'high'].includes(compressionLevel)) {
    throw new HttpError(400, 'level must be one of: low, medium, high');
  }

  const inputPath = await resolveOwnedFilePath(fileId, ownerId);
  const result = await pythonPost('/optimize/compress', { input_path: inputPath, level: compressionLevel });
  const outputFileId = await registerOutputAsFile(result.output_path, ownerId, result.output_filename);

  return {
    output_file_id: outputFileId,
    output_file_name: result.output_filename,
  };
}

module.exports = {
  merge,
  split,
  compress,
};