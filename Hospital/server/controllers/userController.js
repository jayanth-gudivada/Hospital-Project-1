const bcrypt = require('bcryptjs');
const Login = require('../models/Login');
const asyncHandler = require('../utils/asyncHandler');
const { ROLES, ROLE_CODES } = require('../constants/roles');

// Never leak password hashes to the client.
const PUBLIC_FIELDS = '-password';

// GET /api/users  (protected)
const listUsers = asyncHandler(async (req, res) => {
    const users = await Login.find({}).select(PUBLIC_FIELDS).sort({ createdAt: -1 });
    return res.json({ items: users, total: users.length });
});

// POST /api/users  { firstName, middleName?, lastName, email, phone, password, role }  (protected)
const createUser = asyncHandler(async (req, res) => {
    const { firstName, middleName, lastName, email, phone, password, role } = req.body;

    // Presence check up front; the schema enforces format rules on save.
    if (!firstName || !lastName || !email || !phone || !password) {
        return res.status(400).json({ msg: 'first name, last name, email, phone and password are required' });
    }

    // Default to "patient" when no role is supplied; reject unknown codes.
    const roleCode = role === undefined || role === '' ? ROLES.patient : String(role);
    if (!ROLE_CODES.includes(roleCode)) {
        return res.status(400).json({ msg: 'invalid role' });
    }

    // Email and phone must both be unique.
    if (await Login.findOne({ email: String(email).toLowerCase().trim() })) {
        return res.status(409).json({ msg: 'A user with that email already exists' });
    }
    if (await Login.findOne({ phone: String(phone).trim() })) {
        return res.status(409).json({ msg: 'A user with that phone number already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await Login.create({
        firstName,
        middleName: middleName || undefined,
        lastName,
        email,
        phone,
        password: hash,
        role: roleCode,
    });
    return res.status(201).json({ user: await Login.findById(user._id).select(PUBLIC_FIELDS) });
});

// PUT /api/users/:id  { firstName?, middleName?, lastName?, email?, phone?, password?, role? }  (protected)
// Only the fields supplied are changed; password is updated only when non-empty.
const updateUser = asyncHandler(async (req, res) => {
    const { firstName, middleName, lastName, email, phone, password, role } = req.body;
    const update = {};

    if (firstName !== undefined) update.firstName = firstName;
    if (middleName !== undefined) update.middleName = middleName;
    if (lastName !== undefined) update.lastName = lastName;
    if (email !== undefined) update.email = email;
    if (phone !== undefined) update.phone = phone;

    if (role !== undefined && role !== '') {
        const roleCode = String(role);
        if (!ROLE_CODES.includes(roleCode)) {
            return res.status(400).json({ msg: 'invalid role' });
        }
        update.role = roleCode;
    }

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
});

// DELETE /api/users/:id  (protected)
const deleteUser = asyncHandler(async (req, res) => {
    const user = await Login.findByIdAndDelete(req.params.id);
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }
    return res.json({ msg: 'User deleted', id: req.params.id });
});

module.exports = { listUsers, createUser, updateUser, deleteUser };
