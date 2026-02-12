/**
 * Request Model
 * CRUD operations for the requests table.
 */

const { getDb } = require('../config/database');

/**
 * Insert a new service request.
 */
exports.create = (data) => {
    const db = getDb();
    const stmt = db.prepare(`
        INSERT INTO requests (fullName, studentId, email, serviceType, description, submissionDate)
        VALUES (@fullName, @studentId, @email, @serviceType, @description, @submissionDate)
    `);
    const result = stmt.run(data);
    return { id: result.lastInsertRowid, ...data, status: 'pending' };
};

/**
 * Get all requests with optional search, filter, and pagination.
 * @param {Object} opts - { search, status, serviceType, page, limit }
 */
exports.findAll = (opts = {}) => {
    const db = getDb();
    const { search, status, serviceType, page = 1, limit = 50 } = opts;

    let where = [];
    let params = {};

    if (search) {
        where.push("(fullName LIKE @search OR studentId LIKE @search OR email LIKE @search)");
        params.search = `%${search}%`;
    }
    if (status && status !== 'all') {
        where.push("status = @status");
        params.status = status;
    }
    if (serviceType && serviceType !== 'all') {
        where.push("serviceType = @serviceType");
        params.serviceType = serviceType;
    }

    const whereClause = where.length > 0 ? 'WHERE ' + where.join(' AND ') : '';
    const offset = (page - 1) * limit;

    const rows = db.prepare(`
        SELECT * FROM requests ${whereClause}
        ORDER BY id DESC
        LIMIT @limit OFFSET @offset
    `).all({ ...params, limit, offset });

    const countRow = db.prepare(`SELECT COUNT(*) AS total FROM requests ${whereClause}`).get(params);

    return { data: rows, total: countRow.total, page, limit };
};

/**
 * Get a single request by ID.
 */
exports.findById = (id) => {
    const db = getDb();
    return db.prepare('SELECT * FROM requests WHERE id = ?').get(id);
};

/**
 * Update request status (pending / approved / denied).
 */
exports.updateStatus = (id, status) => {
    const db = getDb();
    const result = db.prepare('UPDATE requests SET status = ? WHERE id = ?').run(status, id);
    return result.changes > 0;
};

/**
 * Get dashboard statistics.
 */
exports.getStats = () => {
    const db = getDb();
    const total = db.prepare('SELECT COUNT(*) AS c FROM requests').get().c;
    const pending = db.prepare("SELECT COUNT(*) AS c FROM requests WHERE status = 'pending'").get().c;
    const approved = db.prepare("SELECT COUNT(*) AS c FROM requests WHERE status = 'approved'").get().c;
    const denied = db.prepare("SELECT COUNT(*) AS c FROM requests WHERE status = 'denied'").get().c;

    const today = new Date().toISOString().split('T')[0];
    const todayCount = db.prepare("SELECT COUNT(*) AS c FROM requests WHERE DATE(createdAt) = ?").get(today).c;

    return { total, pending, approved, denied, todayCount };
};

/**
 * Get all requests (no pagination) for CSV export.
 */
exports.findAllForExport = (opts = {}) => {
    const db = getDb();
    const { status, serviceType } = opts;
    let where = [];
    let params = {};

    if (status && status !== 'all') {
        where.push("status = @status");
        params.status = status;
    }
    if (serviceType && serviceType !== 'all') {
        where.push("serviceType = @serviceType");
        params.serviceType = serviceType;
    }

    const whereClause = where.length > 0 ? 'WHERE ' + where.join(' AND ') : '';
    return db.prepare(`SELECT * FROM requests ${whereClause} ORDER BY id DESC`).all(params);
};
