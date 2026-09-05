/**
 * Auth business logic. No HTTP concerns here. * Controllers call these; controllers do NOT touch the DB directly. */
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const model = require('./auth.model');
const { HttpError } = require('../../middlewares/errorHandler.middleware');
const logger = require('../../utils/logger');

const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const BCRYPT_COST = parseInt(process.env.BCRYPT_COST || '10', 10);

/**
 * Convert "15m" / "7d" strings into a future Date for DB expiry. */
function expiresAtFromString(str) {
  const m = String(str).match(/^(\d+)([smhd])$/);
  if (!m) throw new Error(`Invalid expiry string: ${str}`);
  const n = parseInt(m[1], 10);
  const unit = m[2];
  const ms = { s: 1000, m: 60000, h: 3600000, d: 86400000 }[unit];
  return new Date(Date.now() + n * ms);
}

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES }
  );
}

/**
 * Refresh tokens are opaque random strings (not JWTs) so they can
 * be revoked by deleting the session row. */
function signRefreshToken() {
  return crypto.randomBytes(48).toString('hex');
}

function hashRefreshToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function register({ name, email, password }) {
  if (!name || !email || !password) {
    throw new HttpError(400, 'name, email and password are required');
  }
  if (password.length < 8) {
    throw new HttpError(400, 'password must be at least 8 characters');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, 'invalid email format');
  }

  const existing = await model.findUserByEmail(email);
  if (existing) {
    // Don't leak whether email is taken. throw new HttpError(409, 'Unable to create account');
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
  const user = await model.createUser({ name, email, passwordHash });
  logger.info(`User registered: ${user.id}`);
  return user;
}

async function login({ email, password }) {
  if (!email || !password) {
    throw new HttpError(400, 'email and password are required');
  }
  const user = await model.findUserByEmail(email);
  if (!user) {
    throw new HttpError(401, 'Invalid credentials');
  }
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken();
  const refreshHash = hashRefreshToken(refreshToken);
  const expiresAt = expiresAtFromString(REFRESH_EXPIRES);

  await model.createSession({
    userId: user.id,
    refreshTokenHash: refreshHash,
    expiresAt,
  });

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      is_verified: user.is_verified,
    },
  };
}

async function refresh({ refreshToken }) {
  if (!refreshToken) {
    throw new HttpError(400, 'refresh_token is required');
  }
  const hash = hashRefreshToken(refreshToken);
  const session = await model.findSessionByHash(hash);
  if (!session) {
    throw new HttpError(401, 'Invalid refresh token');
  }
  if (new Date(session.expires_at) < new Date()) {
    await model.deleteSessionByHash(hash);
    throw new HttpError(401, 'Refresh token expired');
  }
  const user = await model.findUserById(session.user_id);
  if (!user) {
    await model.deleteSessionByHash(hash);
    throw new HttpError(401, 'User not found');
  }
  return {
    access_token: signAccessToken(user),
  };
}

async function logout({ refreshToken }) {
  if (!refreshToken) {
    throw new HttpError(400, 'refresh_token is required');
  }
  const hash = hashRefreshToken(refreshToken);
  await model.deleteSessionByHash(hash);
  return { message: 'Logged out successfully' };
}

async function getMe(userId) {
  const user = await model.findUserById(userId);
  if (!user) throw new HttpError(404, 'User not found');
  return user;
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
};