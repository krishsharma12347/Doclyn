/**
 * Auth HTTP layer. * Translates req/res into service calls. Wraps async logic so errors
 * flow to the central error handler. */
const service = require('./auth.service');

/**
 * Wrap an async controller so any thrown error reaches next(). * Without this, async errors in Express 4 are silently swallowed. */
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};
  const user = await service.register({ name, email, password });
  return res.status(201).json({
    success: true,
    data: { user_id: user.id, name: user.name, email: user.email },
    message: 'Account created successfully',
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  const result = await service.login({ email, password });
  return res.status(200).json({
    success: true,
    data: result,
    message: 'Login successful',
  });
});

const refresh = asyncHandler(async (req, res) => {
  const { refresh_token } = req.body || {};
  const result = await service.refresh({ refreshToken: refresh_token });
  return res.status(200).json({
    success: true,
    data: result,
    message: 'Token refreshed',
  });
});

const logout = asyncHandler(async (req, res) => {
  const { refresh_token } = req.body || {};
  await service.logout({ refreshToken: refresh_token });
  return res.status(200).json({
    success: true,
    data: null,
    message: 'Logged out successfully',
  });
});

const me = asyncHandler(async (req, res) => {
  const user = await service.getMe(req.user.id);
  return res.status(200).json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      is_verified: user.is_verified,
      created_at: user.created_at,
    },
    message: 'Profile fetched',
  });
});

module.exports = { register, login, refresh, logout, me };