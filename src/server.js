/**
 * GSU Online Services – Express Server
 * Entry point for the backend application.
 */

require('dotenv').config();

const express = require('express');
const path = require('path');
const config = require('./config/config');
const requestRoutes = require('./routes/requestRoutes');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// ─── API Routes ──────────────────────────────────────────────────
app.use('/api/requests', requestRoutes);

// ─── Health Check (for Render uptime monitoring) ─────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ─── Start Server ────────────────────────────────────────────────
const HOST = process.env.HOST || '0.0.0.0';
app.listen(config.PORT, HOST, () => {
    console.log(`\n  🚀  GSU Online Services server running at:`);
    console.log(`      http://${HOST}:${config.PORT}\n`);
});
