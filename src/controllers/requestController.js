/**
 * Request Controller
 * Validates incoming form data and delegates to the request model.
 */

const requestModel = require('../models/requestModel');
const { createObjectCsvStringifier } = require('csv-writer');

/**
 * POST /api/requests – Submit a new service request (requires user login).
 */
exports.submitRequest = (req, res) => {
    try {
        const user = req.session.user;
        const { serviceType, description, submissionDate } = req.body;

        // ── Server-side validation ──────────────────────────────
        const errors = [];
        if (!serviceType) errors.push('Service type is required.');
        if (!description || !description.trim()) errors.push('Description is required.');

        if (errors.length > 0) {
            return res.status(400).json({ error: errors.join(' ') });
        }

        // ── Save to database (user info from session) ───────────
        const row = requestModel.create({
            fullName: user.fullName,
            studentId: user.studentId,
            email: user.email,
            serviceType,
            description: description.trim(),
            submissionDate: submissionDate || new Date().toISOString().split('T')[0],
        });

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
 * GET /api/requests – List all requests with search/filter (protected).
 */
exports.getRequests = (req, res) => {
    try {
        const { search, status, serviceType, page, limit } = req.query;
        const result = requestModel.findAll({
            search,
            status,
            serviceType,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 50,
        });
        return res.json(result);
    } catch (err) {
        console.error('getRequests error:', err);
        return res.status(500).json({ error: 'Failed to retrieve requests.' });
    }
};

/**
 * GET /api/requests/stats – Dashboard statistics (protected).
 */
exports.getStats = (_req, res) => {
    try {
        const stats = requestModel.getStats();
        return res.json(stats);
    } catch (err) {
        console.error('getStats error:', err);
        return res.status(500).json({ error: 'Failed to retrieve statistics.' });
    }
};

/**
 * PATCH /api/requests/:id/status – Approve or deny a request (protected).
 */
exports.updateStatus = (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'approved', 'denied'].includes(status)) {
            return res.status(400).json({ error: 'Status must be pending, approved, or denied.' });
        }

        const updated = requestModel.updateStatus(id, status);
        if (!updated) {
            return res.status(404).json({ error: 'Request not found.' });
        }

        return res.json({ message: `Request ${status}.` });
    } catch (err) {
        console.error('updateStatus error:', err);
        return res.status(500).json({ error: 'Failed to update status.' });
    }
};

/**
 * GET /api/requests/export – Download all requests as CSV (protected).
 */
exports.exportCSV = (req, res) => {
    try {
        const { status, serviceType } = req.query;
        const rows = requestModel.findAllForExport({ status, serviceType });

        const csvStringifier = createObjectCsvStringifier({
            header: [
                { id: 'id', title: 'ID' },
                { id: 'fullName', title: 'Full Name' },
                { id: 'studentId', title: 'Student/Employee ID' },
                { id: 'email', title: 'Email' },
                { id: 'serviceType', title: 'Service Type' },
                { id: 'description', title: 'Description' },
                { id: 'submissionDate', title: 'Submission Date' },
                { id: 'status', title: 'Status' },
                { id: 'createdAt', title: 'Created At' },
            ],
        });

        const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(rows);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=gsu-requests.csv');
        return res.send(csv);
    } catch (err) {
        console.error('exportCSV error:', err);
        return res.status(500).json({ error: 'Failed to export data.' });
    }
};
