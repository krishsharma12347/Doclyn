/**
 * Input validation for auth endpoints. * Keeps the controller thin and the rules in one place. */
const { HttpError } = require('../../middlewares/errorHandler.middleware');

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function validateRegister(body) {
  const { name, email, password } = body || {};
  if (!isNonEmptyString(name)) throw new HttpError(400, 'name is required');
  if (!isNonEmptyString(email)) throw new HttpError(400, 'email is required');
  if (!isNonEmptyString(password)) throw new HttpError(400, 'password is required');
  if (password.length < 8) throw new HttpError(400, 'password must be at least 8 characters');
}

function validateLogin(body) {
  const { email, password } = body || {};
  if (!isNonEmptyString(email)) throw new HttpError(400, 'email is required');
  if (!isNonEmptyString(password)) throw new HttpError(400, 'password is required');
}

function validateRefresh(body) {
  const { refresh_token } = body || {};
  if (!isNonEmptyString(refresh_token)) {
    throw new HttpError(400, 'refresh_token is required');
  }
}

module.exports = {
  validateRegister,
  validateLogin,
  validateRefresh,
};