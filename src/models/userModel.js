/**
 * User Model
 * CRUD operations for the users table.
 */

const { getDb } = require('../config/database');

/**
 * Create a new user.
 */
exports.create = (data) => {
    const db = getDb();
    const stmt = db.prepare(`
        INSERT INTO users (fullName, studentId, email, password)
        VALUES (@fullName, @studentId, @email, @password)
    `);
    const result = stmt.run(data);
    return { id: result.lastInsertRowid, fullName: data.fullName, studentId: data.studentId, email: data.email };
};

/**
 * Find user by email (for login).
 */
exports.findByEmail = (email) => {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
};

/**
 * Find user by ID (for session lookup).
 */
exports.findById = (id) => {
    const db = getDb();
    return db.prepare('SELECT id, fullName, studentId, email, createdAt FROM users WHERE id = ?').get(id);
};

/**
 * Check if email or studentId already exists.
 */
exports.exists = (email, studentId) => {
    const db = getDb();
    const row = db.prepare('SELECT id FROM users WHERE email = ? OR studentId = ?').get(email, studentId);
    return !!row;
};
