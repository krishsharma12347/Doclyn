/**
 * Single Express error handler.
 * All routes wrap async logic so errors reach here.
 * Stack traces -> logger. Safe messages -> client.
 */
const logger = require('../utils/logger');

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

module.exports = function errorHandler(err, req, res, next) {
  void next; // Express signature

  const status = err.status && Number.isInteger(err.status) ? err.status : 500;
  let message = 'Something went wrong, please try again';

  if (status === 400) message = err.message || 'Bad request';
  else if (status === 401) message = 'Unauthorized';
  else if (status === 403) message = 'Forbidden';
  else if (status === 404) message = 'Not found';
  else if (status === 409) message = err.message || 'Conflict';
  else if (status === 413) message = 'File too large';
  else if (status >= 400 && status < 500) message = err.message || message;

  logger.error({
    msg: err.message,
    status,
    method: req.method,
    url: req.originalUrl,
    stack: err.stack,
  });

  return res.status(status).json({
    success: false,
    data: null,
    message,
  });
};

module.exports.HttpError = HttpError;