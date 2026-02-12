/**
 * Auth Middleware
 * Protects routes that require an authenticated session.
 */

/**
 * Require admin session – redirects to admin login.
 */
exports.requireAuth = (req, res, next) => {
    if (req.session && req.session.admin) {
        return next();
    }
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({ error: 'Authentication required.' });
    }
    return res.redirect('/admin/login');
};

/**
 * Require user session – redirects to user login.
 */
exports.requireUser = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({ error: 'Please log in to submit a request.' });
    }
    return res.redirect('/user/login');
};
