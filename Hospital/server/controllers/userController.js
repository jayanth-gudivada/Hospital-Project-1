const bcrypt = require('bcryptjs');
const Login = require('../models/Login');

// Never leak password hashes to the client.
const PUBLIC_FIELDS = '-password';

// GET /api/users  (protected)
const listUsers = async (req, res) => {
    try {
        const users = await Login.find({}).select(PUBLIC_FIELDS).sort({ createdAt: -1 });
        return res.json({ items: users, total: users.length });
    } catch (error) {
        return res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

// POST /api/users  { email, password }  (protected)
const createUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: 'email and password are required' });
        }

        const exists = await Login.findOne({ email });
        if (exists) {
            return res.status(409).json({ msg: 'A user with that email already exists' });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await Login.create({ email, password: hash });
        return res.status(201).json({ user: { id: user._id, email: user.email } });
    } catch (error) {
        return res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

// PUT /api/users/:id  { email, password? }  (protected)
// Password is only changed when a non-empty value is supplied.
const updateUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const update = {};
        if (email) update.email = email;
        if (password && password.trim()) {
            update.password = await bcrypt.hash(password, 10);
        }

        const user = await Login.findByIdAndUpdate(req.params.id, update, {
            new: true,
            runValidators: true,
        }).select(PUBLIC_FIELDS);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        return res.json({ user });
    } catch (error) {
        return res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

// DELETE /api/users/:id  (protected)
const deleteUser = async (req, res) => {
    try {
        const user = await Login.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        return res.json({ msg: 'User deleted', id: req.params.id });
    } catch (error) {
        return res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

module.exports = { listUsers, createUser, updateUser, deleteUser };
