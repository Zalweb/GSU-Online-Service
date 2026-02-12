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

// ─── Start Server ────────────────────────────────────────────────
app.listen(config.PORT, () => {
    console.log(`\n  🚀  GSU Online Services server running at:`);
    console.log(`      http://localhost:${config.PORT}\n`);
});
