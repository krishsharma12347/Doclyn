/**
 * PostgreSQL connection pool using node-postgres (pg).
 * Pool gives independent connections per request.
 */
require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected pg pool error', err);
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
};