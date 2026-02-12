/**
 * Request Routes
 * Public and protected API endpoints for service requests.
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/requestController');
const { requireAuth, requireUser } = require('../middleware/authMiddleware');

// ── Requires user login ──────────────────────────────────────────
router.post('/', requireUser, controller.submitRequest);

// ── Protected (admin only) ───────────────────────────────────────
router.get('/', requireAuth, controller.getRequests);
router.get('/stats', requireAuth, controller.getStats);
router.get('/export', requireAuth, controller.exportCSV);
router.patch('/:id/status', requireAuth, controller.updateStatus);

module.exports = router;
