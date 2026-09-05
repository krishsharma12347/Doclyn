/**
 * JWT auth middleware.
 * Reads `Authorization: Bearer <token>`, verifies with JWT_ACCESS_SECRET,
 * attaches decoded payload to req.user.
 */
const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Missing or invalid Authorization header',
      });
    }

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Invalid or expired token',
    });
  }
};