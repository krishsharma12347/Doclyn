/**
 * Files data layer. * Tracks every PDF uploaded by users. The file itself lives on disk
 * (storage.js); this table just holds the metadata. */
const db = require('../../config/db.postgres');

async function createFile({ id, ownerId, originalName, sizeBytes }) {
  const { rows } = await db.query(
    `INSERT INTO files (id, owner_id, original_name, size_bytes)
     VALUES ($1, $2, $3, $4)
     RETURNING id, owner_id, original_name, size_bytes, created_at`,
    [id, ownerId, originalName, sizeBytes]
  );
  return rows[0];
}

async function findFileById(id) {
  const { rows } = await db.query(
    `SELECT id, owner_id, original_name, size_bytes, created_at
     FROM files WHERE id = $1 LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function listFilesByOwner(ownerId, limit = 50) {
  const { rows } = await db.query(
    `SELECT id, original_name, size_bytes, created_at
     FROM files WHERE owner_id = $1
     ORDER BY created_at DESC LIMIT $2`,
    [ownerId, limit]
  );
  return rows;
}

async function deleteFileById(id, ownerId) {
  const { rowCount } = await db.query(
    'DELETE FROM files WHERE id = $1 AND owner_id = $2',
    [id, ownerId]
  );
  return rowCount > 0;
}

module.exports = {
  createFile,
  findFileById,
  listFilesByOwner,
  deleteFileById,
};