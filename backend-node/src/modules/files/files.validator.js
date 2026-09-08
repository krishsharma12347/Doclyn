/**
 * Input validation for files endpoints. */
const { HttpError } = require('../../middlewares/errorHandler.middleware');

function validateUuid(value) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!value || !uuidRegex.test(value)) {
    throw new HttpError(400, 'Invalid file_id format');
  }
}

function validateUploadQuery(body, files) {
  if (!files || !files.file) {
    throw new HttpError(400, 'No file provided. Use multipart field "file"');
  }
}

module.exports = {
  validateUuid,
  validateUploadQuery,
};