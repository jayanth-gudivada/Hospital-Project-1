const Login = require('../models/Login');
const { ROLES } = require('../constants/roles');

// Authorisation gate: must run AFTER requireAuth (which sets req.user.id).
//
// requireAuth only proves "a valid token" — it does NOT prove the caller is an
// admin. Without this, any signed-in user (including a patient) could hit the
// user-management and hospital-write endpoints and, e.g., self-promote to admin.
//
// The JWT deliberately carries only { id, email }, so we load the current role
// from the DB rather than trusting a (stale/absent) token claim. Legacy accounts
// predate roles and were all admins, so a missing role is treated as admin — the
// same rule the client uses (see lib/roles.ts effectiveRole).
function requireRole(...allowedCodes) {
    return async (req, res, next) => {
        try {
            const user = await Login.findById(req.user.id).select('role');
            if (!user) {
                return res.status(401).json({ msg: 'Authentication required' });
            }
            const role = user.role || ROLES.admin; // legacy rows (no role) = admin
            if (!allowedCodes.includes(role)) {
                return res.status(403).json({ msg: 'You do not have access to this resource' });
            }
            next();
        } catch (err) {
            next(err);
        }
    };
}

module.exports = requireRole;
