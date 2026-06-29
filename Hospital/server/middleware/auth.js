const jwt = require('jsonwebtoken');

// Protects routes: requires a valid "Authorization: Bearer <token>" header.
function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
        return res.status(401).json({ msg: 'Authentication required' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: payload.id, email: payload.email };
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Invalid or expired token' });
    }
}

module.exports = requireAuth;
