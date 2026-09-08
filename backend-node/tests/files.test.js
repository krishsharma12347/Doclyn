/**
 * Files endpoint tests.
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
    .send({ email, password: 'Password123!', name: 'Files Test User' });

  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({ email, password: 'Password123!' });

  return loginRes.body.data.access_token;
}

describe('POST /api/v1/files/upload', () => {
  let token;

  beforeEach(async () => {
    token = await getAuthToken('files');
  });

  it('should upload a valid PDF and return 201', async () => {
    const pdfBuffer = Buffer.from('%PDF-1.4 test pdf content');

    const res = await request(app)
      .post('/api/v1/files/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', pdfBuffer, {
        filename: 'test.pdf',
        contentType: 'application/pdf',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('file_id');
    expect(res.body.data.original_name).toBe('test.pdf');
  });

  it('should return 401 without auth token', async () => {
    const pdfBuffer = Buffer.from('%PDF-1.4 test pdf content');

    const res = await request(app)
      .post('/api/v1/files/upload')
      .attach('file', pdfBuffer, {
        filename: 'test.pdf',
        contentType: 'application/pdf',
      });

    expect(res.status).toBe(401);
  });

  it('should return 400 for non-PDF file', async () => {
    const txtBuffer = Buffer.from('This is not a PDF');

    const res = await request(app)
      .post('/api/v1/files/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', txtBuffer, {
        filename: 'test.txt',
        contentType: 'text/plain',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/v1/files/list', () => {
  let token;

  beforeEach(async () => {
    token = await getAuthToken('list');
  });

  it('should return empty list for new user', async () => {
    const res = await request(app)
      .get('/api/v1/files/list')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(0);
  });

  it('should return 401 without auth token', async () => {
    const res = await request(app).get('/api/v1/files/list');

    expect(res.status).toBe(401);
  });
});

describe('DELETE /api/v1/files/:file_id', () => {
  let token;
  let fileId;

  beforeEach(async () => {
    token = await getAuthToken('delete');

    const pdfBuffer = Buffer.from('%PDF-1.4 test pdf content');
    const uploadRes = await request(app)
      .post('/api/v1/files/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', pdfBuffer, {
        filename: 'test.pdf',
        contentType: 'application/pdf',
      });
    fileId = uploadRes.body.data.file_id;
  });

  it('should delete own file and return 200', async () => {
    const res = await request(app)
      .delete(`/api/v1/files/${fileId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should return 404 for non-existent file', async () => {
    const fakeId = '00000000-0000-4000-8000-000000000000';

    const res = await request(app)
      .delete(`/api/v1/files/${fakeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('should return 400 for invalid file_id format', async () => {
    const res = await request(app)
      .delete('/api/v1/files/not-a-uuid')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });
});