/**
 * Request Routes
 * Defines API endpoints for service request operations.
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/requestController');

// POST /api/requests – submit a new service request
router.post('/', controller.submitRequest);

module.exports = router;
