/**
 * Tools endpoint tests.
 * These are validation-level tests (400/401 cases) that don't require
 * the Python service to be running. A full merge/split/compress happy-path
 * test belongs in an integration suite that also spins up backend-python.
 */
const request = require('supertest');
const app = require('../src/app');

/**
 * Helper: register + login, return an access token.
 * FIX: register doesn't return a token, so every test that needs one
 * now explicitly logs in afterwards.
 */
async function getAuthToken(emailPrefix) {
  const email = `${emailPrefix}-${Date.now()}@example.com`;
  await request(app)
    .post('/api/v1/auth/register')
    .send({ email, password: 'Password123!', name: 'Tools Test User' });

  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({ email, password: 'Password123!' });

  return loginRes.body.data.access_token;
}

describe('POST /api/v1/tools/merge', () => {
  let token;

  beforeEach(async () => {
    token = await getAuthToken('merge');
  });

  it('should return 400 if less than 2 file_ids provided', async () => {
    const res = await request(app)
      .post('/api/v1/tools/merge')
      .set('Authorization', `Bearer ${token}`)
      .send({ file_ids: ['12345678-1234-4234-8234-123456789012'] });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    // FIX: our error envelope uses `message`, not `error`.
    expect(res.body.message).toContain('At least 2 file_ids required');
  });

  it('should return 400 if file_ids is missing', async () => {
    const res = await request(app)
      .post('/api/v1/tools/merge')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for invalid file_id format', async () => {
    const res = await request(app)
      .post('/api/v1/tools/merge')
      .set('Authorization', `Bearer ${token}`)
      .send({ file_ids: ['not-a-valid-uuid', 'also-not-valid'] });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 without auth token', async () => {
    const res = await request(app)
      .post('/api/v1/tools/merge')
      .send({ file_ids: ['12345678-1234-4234-8234-123456789012', '12345678-1234-4234-8234-123456789013'] });

    expect(res.status).toBe(401);
  });
});

describe('POST /api/v1/tools/split', () => {
  let token;

  beforeEach(async () => {
    token = await getAuthToken('split');
  });

  it('should return 400 if file_id is missing', async () => {
    const res = await request(app)
      .post('/api/v1/tools/split')
      .set('Authorization', `Bearer ${token}`)
      .send({ pages: '1-3' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 if pages is missing', async () => {
    const res = await request(app)
      .post('/api/v1/tools/split')
      .set('Authorization', `Bearer ${token}`)
      .send({ file_id: '12345678-1234-4234-8234-123456789012' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for invalid file_id format', async () => {
    const res = await request(app)
      .post('/api/v1/tools/split')
      .set('Authorization', `Bearer ${token}`)
      .send({ file_id: 'invalid-uuid', pages: '1-3' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for malformed pages string', async () => {
    const res = await request(app)
      .post('/api/v1/tools/split')
      .set('Authorization', `Bearer ${token}`)
      .send({ file_id: '12345678-1234-4234-8234-123456789012', pages: 'not-a-range' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 without auth token', async () => {
    const res = await request(app)
      .post('/api/v1/tools/split')
      .send({ file_id: '12345678-1234-4234-8234-123456789012', pages: '1-3' });

    expect(res.status).toBe(401);
  });
});

describe('POST /api/v1/tools/compress', () => {
  let token;

  beforeEach(async () => {
    token = await getAuthToken('compress');
  });

  it('should return 400 if file_id is missing', async () => {
    const res = await request(app)
      .post('/api/v1/tools/compress')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for invalid file_id format', async () => {
    const res = await request(app)
      .post('/api/v1/tools/compress')
      .set('Authorization', `Bearer ${token}`)
      .send({ file_id: 'not-a-valid-uuid' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for invalid compression level', async () => {
    const res = await request(app)
      .post('/api/v1/tools/compress')
      .set('Authorization', `Bearer ${token}`)
      .send({ file_id: '12345678-1234-4234-8234-123456789012', level: 'ultra' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 without auth token', async () => {
    const res = await request(app)
      .post('/api/v1/tools/compress')
      .send({ file_id: '12345678-1234-4234-8234-123456789012' });

    expect(res.status).toBe(401);
  });
});