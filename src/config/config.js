/**
 * Server Configuration
 * Reads environment variables and provides sensible defaults.
 */

const path = require('path');

module.exports = {
    PORT: process.env.PORT || 3000,
    EXCEL_PATH: process.env.EXCEL_PATH || path.join(__dirname, '..', '..', 'storage', 'submissions.xlsx'),
};
