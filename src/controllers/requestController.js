/**
 * Request Controller
 * Validates incoming form data and delegates to the Excel helper.
 */

const excelHelper = require('../helpers/excelHelper');

/**
 * Handle POST /api/requests
 */
exports.submitRequest = async (req, res) => {
    try {
        const { fullName, studentId, email, serviceType, description } = req.body;

        // ── Server-side validation ──────────────────────────────────
        const errors = [];
        if (!fullName || !fullName.trim()) errors.push('Full name is required.');
        if (!studentId || !studentId.trim()) errors.push('Student ID is required.');
        if (!email || !email.trim()) errors.push('Email is required.');
        if (!serviceType) errors.push('Service type is required.');
        if (!description || !description.trim()) errors.push('Description is required.');

        if (errors.length > 0) {
            return res.status(400).json({ error: errors.join(' ') });
        }

        // ── Build row data ──────────────────────────────────────────
        const row = {
            timestamp: new Date().toISOString(),
            fullName: fullName.trim(),
            studentId: studentId.trim(),
            email: email.trim(),
            serviceType,
            description: description.trim(),
        };

        await excelHelper.appendRow(row);

        return res.status(201).json({
            message: 'Request submitted successfully!',
            data: row,
        });
    } catch (err) {
        console.error('submitRequest error:', err);
        return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
};

/**
 * Handle GET /api/requests
 * Returns all submissions as JSON.
 */
exports.getRequests = async (_req, res) => {
    try {
        const rows = await excelHelper.getAllRows();
        return res.json({ data: rows, count: rows.length });
    } catch (err) {
        console.error('getRequests error:', err);
        return res.status(500).json({ error: 'Failed to retrieve submissions.' });
    }
};

/**
 * Handle GET /api/requests/download
 * Sends the Excel file as a download.
 */
const path = require('path');
const fs = require('fs');

exports.downloadExcel = (_req, res) => {
    try {
        const filePath = excelHelper.getFilePath();

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'No submissions file found yet.' });
        }

        const filename = path.basename(filePath);
        res.download(filePath, filename);
    } catch (err) {
        console.error('downloadExcel error:', err);
        return res.status(500).json({ error: 'Failed to download file.' });
    }
};
