/**
 * Admin Model
 * Queries for the admins table.
 */

const { getDb } = require('../config/database');

/**
 * Find an admin by username.
 * @param {string} username
 * @returns {Object|undefined}
 */
exports.findByUsername = (username) => {
    const db = getDb();
    return db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
};
