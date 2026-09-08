/**
 * Jest setup file. * Runs before every test file. */
const db = require('../src/config/db.postgres');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/doclyn_test';

// Increase timeout for integration tests
jest.setTimeout(30000);

// Clean up database tables after each test
afterEach(async () => {
  await db.query('DELETE FROM files');
  await db.query('DELETE FROM users');
});

// Close DB connection after all tests
afterAll(async () => {
  await db.end();
});