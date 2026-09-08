/**
 * Database migration script.
 * Reads schema.sql and runs it against the database.
 * Safe to re-run — uses IF NOT EXISTS / ON CONFLICT DO NOTHING.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  // FIX: this file lives at backend-node/scripts/migrate.js, and schema.sql
  // lives at backend-node/schema.sql — that's only ONE directory up, not two.
  // The old path (`'..', '..'`) pointed outside the project entirely, so the
  // script always printed "schema.sql not found" and exited.
  const schemaPath = path.join(__dirname, '..', 'schema.sql');

  if (!fs.existsSync(schemaPath)) {
    console.error('schema.sql not found at:', schemaPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(schemaPath, 'utf8');

  console.log('Running migrations...');
  try {
    await pool.query(sql);
    console.log('Migrations complete.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// FIX: the function was defined but never actually invoked, so running
// `node scripts/migrate.js` did nothing at all — silently exited with no
// tables created and no error message.
migrate();