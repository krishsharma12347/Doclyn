/**
 * Express app setup.
 * Mounts all route modules and global middlewares.
 */
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler.middleware');

const authRoutes = require('./modules/auth/auth.routes');
const filesRoutes = require('./modules/files/files.routes');
const toolsRoutes = require('./modules/tools/tools.routes');

const app = express();

// Global middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check (kept unprefixed — deployment/uptime tools expect it at the root)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
// FIX: our locked API contract (Master Documentation, Section 6) specifies
// every endpoint under /api/v1/*. These were previously mounted at the bare
// /auth, /files, /tools paths, which would have broken every frontend call
// and every Phase 2 endpoint that assumes the /api/v1 prefix.
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/files', filesRoutes);
app.use('/api/v1/tools', toolsRoutes);

// 404 handler
app.use((req, res, next) => {
  void next;
  res.status(404).json({
    success: false,
    data: null,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Central error handler
app.use(errorHandler);

module.exports = app;