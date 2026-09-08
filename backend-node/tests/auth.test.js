/**
 * Auth endpoint tests.
 */
const request = require('supertest');
const app = require('../src/app');

describe('POST /api/v1/auth/register', () => {
  it('should register a new user and return 201', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: `register-${Date.now()}@example.com`,
        password: 'Password123!',
        name: 'Test User',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('user_id');
    expect(res.body.data).toHaveProperty('email');
    expect(res.body.data).toHaveProperty('name', 'Test User');
    expect(res.body.data).not.toHaveProperty('password');
  });

  it('should return 400 for missing fields', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'test@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 409 for duplicate email', async () => {
    const email = `duplicate-${Date.now()}@example.com`;

    await request(app)
      .post('/api/v1/auth/register')
      .send({ email, password: 'Password123!', name: 'First User' });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email, password: 'Password123!', name: 'Second User' });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/v1/auth/login', () => {
  const email = `login-${Date.now()}@example.com`;

  beforeEach(async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({ email, password: 'Password123!', name: 'Login Test User' });
  });

  it('should login with valid credentials and return 200', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password: 'Password123!' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // FIX: the controller returns `access_token` + a nested `user` object,
    // not a flat `token` / `user_id` — the old test was checking properties
    // that never existed on the real response.
    expect(res.body.data).toHaveProperty('access_token');
    expect(res.body.data).toHaveProperty('refresh_token');
    expect(res.body.data.user).toHaveProperty('id');
    expect(res.body.data.user).toHaveProperty('email', email);
  });

  it('should return 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password: 'WrongPassword!' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 for non-existent email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'notexist@example.com', password: 'Password123!' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/v1/auth/me', () => {
  const email = `me-${Date.now()}@example.com`;
  let accessToken;

  beforeEach(async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({ email, password: 'Password123!', name: 'Me Test User' });

    // FIX: register doesn't return a token — must log in separately to get one.
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password: 'Password123!' });

    accessToken = loginRes.body.data.access_token;
  });

  it('should return user info for valid token', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('email', email);
    expect(res.body.data).not.toHaveProperty('password');
  });

  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/v1/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 with invalid token', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer invalid-token-12345');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});