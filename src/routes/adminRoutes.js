/**
 * Admin Routes
 * Login, logout, and admin dashboard page routes.
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

// ── Auth ─────────────────────────────────────────────────────────
router.get('/login', authController.loginPage);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// ── Dashboard (protected) ───────────────────────────────────────
router.get('/', requireAuth, (_req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'admin.html'));
});

module.exports = router;
