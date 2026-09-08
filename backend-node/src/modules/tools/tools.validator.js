/**
 * Input validation for tools endpoints.
 */
const { HttpError } = require('../../middlewares/errorHandler.middleware');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PAGE_RANGE_REGEX = /^\s*\d+(\s*-\s*\d+)?(\s*,\s*\d+(\s*-\s*\d+)?)*\s*$/;

function isValidUuid(value) {
  return typeof value === 'string' && UUID_REGEX.test(value);
}

function validateMerge(body) {
  const { file_ids } = body || {};
  if (!file_ids) throw new HttpError(400, 'file_ids is required');
  if (!Array.isArray(file_ids)) throw new HttpError(400, 'file_ids must be an array');
  if (file_ids.length < 2) throw new HttpError(400, 'At least 2 file_ids required for merge');
  for (const id of file_ids) {
    if (!isValidUuid(id)) throw new HttpError(400, `Invalid file_id: ${id}`);
  }
}

function validateSplit(body) {
  const { file_id, pages } = body || {};
  if (!file_id) throw new HttpError(400, 'file_id is required');
  if (!isValidUuid(file_id)) throw new HttpError(400, 'Invalid file_id format');
  if (!pages) throw new HttpError(400, 'pages is required');
  // FIX: page_ranges array check replaced — the contract with the Python
  // service (and our API contract doc) is a single string like "1-3,5".
  if (typeof pages !== 'string' || !PAGE_RANGE_REGEX.test(pages)) {
    throw new HttpError(400, 'pages must be a string like "1-3,5"');
  }
}

function validateCompress(body) {
  const { file_id, level } = body || {};
  if (!file_id) throw new HttpError(400, 'file_id is required');
  if (!isValidUuid(file_id)) throw new HttpError(400, 'Invalid file_id format');
  // level is optional (defaults to "medium" in the service), but if given
  // it must be one of the three allowed values.
  if (level !== undefined && !['low', 'medium', 'high'].includes(level)) {
    throw new HttpError(400, 'level must be one of: low, medium, high');
  }
}

module.exports = {
  validateMerge,
  validateSplit,
  validateCompress,
};