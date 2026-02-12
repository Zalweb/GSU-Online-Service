/**
 * Request Routes
 * Defines API endpoints for service request operations.
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/requestController');

// POST /api/requests – submit a new service request
router.post('/', controller.submitRequest);

// GET /api/requests – list all submissions
router.get('/', controller.getRequests);

// GET /api/requests/download – download the Excel file
router.get('/download', controller.downloadExcel);

module.exports = router;
