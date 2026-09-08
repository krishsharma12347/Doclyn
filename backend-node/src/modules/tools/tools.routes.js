/**
 * Tools routes. * All are protected — auth middleware required. */
const express = require('express');
const controller = require('./tools.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/merge', authMiddleware, controller.merge);
router.post('/split', authMiddleware, controller.split);
router.post('/compress', authMiddleware, controller.compress);

module.exports = router;