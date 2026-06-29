const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Login = require('../models/Login');

const TOKEN_TTL = '8h';

function signToken(user) {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: TOKEN_TTL }
    );
}

// A bcrypt hash always begins with "$2a$", "$2b$" or "$2y$".
function looksHashed(value) {
    return typeof value === 'string' && /^\$2[aby]\$/.test(value);
}

// POST /api/auth/login  { email, password }
const login = async (req, res) => {
    try {
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
            ok = password === user.password;
            if (ok) {
                user.password = await bcrypt.hash(password, 10);
                await user.save();
            }
        }

        if (!ok) {
            return res.status(401).json({ msg: 'Invalid email or password' });
        }

        return res.json({
            token: signToken(user),
            user: { id: user._id, email: user.email },
        });
    } catch (error) {
        return res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

// GET /api/auth/me  (protected) — lets the SPA confirm the token is still valid
const me = async (req, res) => {
    return res.json({ user: req.user });
};

module.exports = { login, me };
