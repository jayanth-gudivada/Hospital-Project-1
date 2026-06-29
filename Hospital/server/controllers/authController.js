const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Login = require('../models/Login');
const asyncHandler = require('../utils/asyncHandler');

const TOKEN_TTL = '8h';

// Issue a signed JWT carrying the user's id + email.
function signToken(user) {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: TOKEN_TTL }
    );
}

// The profile shape sent to the client / stored in the Redux store (never the hash).
function publicUser(user) {
    return {
        id: user._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
    };
}

// A bcrypt hash always begins with "$2a$", "$2b$" or "$2y$".
function looksHashed(value) {
    return typeof value === 'string' && /^\$2[aby]\$/.test(value);
}

// POST /api/auth/login  { email, password }
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: 'Email and password are required' });
    }

    const user = await Login.findOne({ email });
    if (!user) {
        return res.status(401).json({ msg: 'Invalid email or password' });
    }

    let ok;
    if (looksHashed(user.password)) {
        ok = await bcrypt.compare(password, user.password);
    } else {
        // Legacy plaintext row: compare directly, then transparently upgrade to a hash.
        // Skip full-document validation so legacy rows missing the newer required
        // fields (firstName/lastName/phone) can still upgrade their password.
        ok = password === user.password;
        if (ok) {
            user.password = await bcrypt.hash(password, 10);
            await user.save({ validateBeforeSave: false });
        }
    }

    if (!ok) {
        return res.status(401).json({ msg: 'Invalid email or password' });
    }

    return res.json({ token: signToken(user), user: publicUser(user) });
});

// GET /api/auth/me  (protected) — re-loads the full profile so the SPA can
// rehydrate its store on refresh and confirm the token is still valid.
const me = asyncHandler(async (req, res) => {
    const user = await Login.findById(req.user.id).select('-password');
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }
    return res.json({ user: publicUser(user) });
});

module.exports = { login, me };
