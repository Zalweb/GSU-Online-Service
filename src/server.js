/**
 * GSU Online Services – Express Server
 * Entry point for the backend application.
 */

require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const config = require('./config/config');
const database = require('./config/database');
const requestRoutes = require('./routes/requestRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const { requireUser } = require('./middleware/authMiddleware');

// ── Initialise database ──────────────────────────────────────────
database.init();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (required for admin + user auth)
app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' && process.env.TRUST_PROXY === 'true',
        maxAge: 1000 * 60 * 60 * 8, // 8 hours
    },
}));

// Trust proxy (for Railway / Render HTTPS)
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// ─── Protected page: request.html requires user login ────────────
app.get('/request.html', requireUser, (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'request.html'));
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// ─── API Routes ──────────────────────────────────────────────────
app.use('/api/requests', requestRoutes);

// ─── User Routes ─────────────────────────────────────────────────
app.use('/user', userRoutes);

// ─── Admin Routes ────────────────────────────────────────────────
app.use('/admin', adminRoutes);

// ─── Health Check ────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ─── Start Server ────────────────────────────────────────────────
const HOST = process.env.HOST || '0.0.0.0';
app.listen(config.PORT, HOST, () => {
    console.log(`\n  🚀  GSU Online Services server running at:`);
    console.log(`      http://${HOST}:${config.PORT}\n`);
});
