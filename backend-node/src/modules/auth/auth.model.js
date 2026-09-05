/**
 * Auth data layer. Only place that writes SQL for users + sessions.
 */
const db = require('../../config/db.postgres');

async function findUserByEmail(email) {
  const { rows } = await db.query(
    'SELECT id, name, email, password_hash, is_verified, created_at FROM users WHERE email = $1 LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

async function findUserById(id) {
  const { rows } = await db.query(
    'SELECT id, name, email, is_verified, created_at FROM users WHERE id = $1 LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

async function createUser({ name, email, passwordHash }) {
  const { rows } = await db.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, is_verified, created_at`,
    [name, email, passwordHash]
  );
  return rows[0];
}

async function createSession({ userId, refreshTokenHash, expiresAt }) {
  const { rows } = await db.query(
    `INSERT INTO sessions (user_id, refresh_token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING id, created_at`,
    [userId, refreshTokenHash, expiresAt]
  );
  return rows[0];
}

async function findSessionByHash(refreshTokenHash) {
  const { rows } = await db.query(
    `SELECT id, user_id, expires_at FROM sessions WHERE refresh_token_hash = $1 LIMIT 1`,
    [refreshTokenHash]
  );
  return rows[0] || null;
}

async function deleteSessionByHash(refreshTokenHash) {
  await db.query('DELETE FROM sessions WHERE refresh_token_hash = $1', [refreshTokenHash]);
}

async function deleteAllSessionsForUser(userId) {
  await db.query('DELETE FROM sessions WHERE user_id = $1', [userId]);
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  createSession,
  findSessionByHash,
  deleteSessionByHash,
  deleteAllSessionsForUser,
};