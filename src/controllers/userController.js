/**
 * User Controller
 * Handles user registration, login, and logout.
 */

const bcrypt = require('bcryptjs');
const path = require('path');
const userModel = require('../models/userModel');

/**
 * GET /user/register – Serve registration page.
 */
exports.registerPage = (_req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'register.html'));
};

/**
 * POST /user/register – Create a new user account.
 */
exports.register = (req, res) => {
    try {
        const { fullName, studentId, email, password, confirmPassword } = req.body;

        // Validation
        const errors = [];
        if (!fullName || !fullName.trim()) errors.push('Full name is required.');
        if (!studentId || !studentId.trim()) errors.push('Student/Employee ID is required.');
        if (!email || !email.trim()) errors.push('Email is required.');
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Invalid email format.');
        if (!password || password.length < 6) errors.push('Password must be at least 6 characters.');
        if (password !== confirmPassword) errors.push('Passwords do not match.');

        if (errors.length > 0) {
            return res.status(400).json({ error: errors.join(' ') });
        }

        // Check if user already exists
        if (userModel.exists(email.trim(), studentId.trim())) {
            return res.status(409).json({ error: 'An account with this email or student ID already exists.' });
        }

        // Create user
        const hashed = bcrypt.hashSync(password, 10);
        const user = userModel.create({
            fullName: fullName.trim(),
            studentId: studentId.trim(),
            email: email.trim(),
            password: hashed,
        });

        // Auto-login after registration
        req.session.user = { id: user.id, fullName: user.fullName, studentId: user.studentId, email: user.email };

        return res.status(201).json({ message: 'Account created successfully!', redirect: '/request.html' });
    } catch (err) {
        console.error('register error:', err);
        return res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
};

/**
 * GET /user/login – Serve login page.
 */
exports.loginPage = (_req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'user-login.html'));
};

/**
 * POST /user/login – Authenticate user.
 */
exports.login = (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const user = userModel.findByEmail(email.trim());

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        req.session.user = { id: user.id, fullName: user.fullName, studentId: user.studentId, email: user.email };
        return res.json({ message: 'Login successful.', redirect: '/request.html' });
    } catch (err) {
        console.error('user login error:', err);
        return res.status(500).json({ error: 'Login failed. Please try again.' });
    }
};

/**
 * GET /user/logout – Destroy session and redirect.
 */
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

/**
 * GET /user/me – Return current user info (for frontend).
 */
exports.me = (req, res) => {
    if (req.session && req.session.user) {
        return res.json({ loggedIn: true, user: req.session.user });
    }
    return res.json({ loggedIn: false });
};
