/**
 * Server Configuration
 * Reads environment variables and provides sensible defaults.
 */

const path = require('path');

module.exports = {
    PORT: process.env.PORT || 3000,
    DB_PATH: process.env.DB_PATH || path.join(__dirname, '..', '..', 'storage', 'gsu.db'),
    SESSION_SECRET: process.env.SESSION_SECRET || 'gsu-secret-change-me-in-production',
};
