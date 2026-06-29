const mongoose = require('mongoose');

// Same collection as the legacy app ("logins"), so existing admin accounts are reused.
// NOTE: legacy rows store plaintext passwords. The auth controller transparently
// upgrades them to bcrypt hashes on the next successful login (see authController).
const LoginSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'must provide email'],
            trim: true,
            unique: true,
            maxlength: [50, 'email cannot be more than 50 characters'],
        },
        password: {
            type: String,
            required: [true, 'must provide password'],
            trim: true,
            maxlength: [120, 'password hash cannot be more than 120 characters'],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Login', LoginSchema);
