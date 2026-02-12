/**
 * Database Setup (SQLite)
 * Initialises tables and seeds a default admin user on first run.
 */

const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const config = require('./config');

let db;

/**
 * Initialise the database, create tables, and seed admin.
 * @returns {Database} the better-sqlite3 instance
 */
function init() {
    // Ensure storage directory exists
    const dir = path.dirname(config.DB_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    db = new Database(config.DB_PATH);

    // Enable WAL mode for better concurrent read performance
    db.pragma('journal_mode = WAL');

    // ── Create tables ────────────────────────────────────────────
    db.exec(`
        CREATE TABLE IF NOT EXISTS requests (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            fullName    TEXT    NOT NULL,
            studentId   TEXT    NOT NULL,
            email       TEXT    NOT NULL,
            serviceType TEXT    NOT NULL,
            description TEXT    NOT NULL,
            submissionDate TEXT NOT NULL,
            status      TEXT    NOT NULL DEFAULT 'pending',
            createdAt   TEXT    NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS admins (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            username  TEXT    NOT NULL UNIQUE,
            password  TEXT    NOT NULL,
            createdAt TEXT    NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS users (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            fullName  TEXT    NOT NULL,
            studentId TEXT    NOT NULL UNIQUE,
            email     TEXT    NOT NULL UNIQUE,
            password  TEXT    NOT NULL,
            createdAt TEXT    NOT NULL DEFAULT (datetime('now'))
        );
    `);

    // ── Seed default admin (only if table is empty) ──────────────
    const count = db.prepare('SELECT COUNT(*) AS c FROM admins').get();
    if (count.c === 0) {
        const username = process.env.ADMIN_USER || 'admin';
        const plainPass = process.env.ADMIN_PASS || 'admin123';
        const hashed = bcrypt.hashSync(plainPass, 10);
        db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run(username, hashed);
        console.log(`  ✅  Default admin seeded (username: "${username}")`);
    }

    console.log('  ✅  Database initialised');
    return db;
}

/**
 * Get the database instance. Must call init() first.
 */
function getDb() {
    if (!db) throw new Error('Database not initialised. Call init() first.');
    return db;
}

module.exports = { init, getDb };
