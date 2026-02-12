/**
 * Auth Controller
 * Handles admin login and logout.
 */

const bcrypt = require('bcryptjs');
const path = require('path');
const adminModel = require('../models/adminModel');

/**
 * GET /admin/login – Serve the login page.
 */
exports.loginPage = (_req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'login.html'));
};

/**
 * POST /admin/login – Authenticate admin.
 */
exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    const admin = adminModel.findByUsername(username);

    if (!admin || !bcrypt.compareSync(password, admin.password)) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // Create session
    req.session.admin = { id: admin.id, username: admin.username };
    return res.json({ message: 'Login successful.', redirect: '/admin' });
};

/**
 * GET /admin/logout – Destroy session and redirect.
 */
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/admin/login');
    });
};
