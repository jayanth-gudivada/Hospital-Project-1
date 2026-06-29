const mongoose = require('mongoose');
const { ROLE_CODES, ROLES } = require('../constants/roles');

// Field-format rules reused by validation.
const NAME_RX = /^[A-Za-z]+$/;                                       // letters only
const EMAIL_RX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/; // rejects commas/spaces etc.
const PHONE_RX = /^[0-9]{10}$/;                                      // exactly 10 digits

// Same collection as the legacy app ("logins"), so existing admin accounts are reused.
// NOTE: legacy rows store plaintext passwords. The auth controller transparently
// upgrades them to bcrypt hashes on the next successful login (see authController).
const LoginSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'must provide first name'],
            trim: true,
            match: [NAME_RX, 'first name can only contain letters'],
            maxlength: [40, 'first name cannot be more than 40 characters'],
        },
        middleName: {
            type: String,
            trim: true,
            // Optional: allow empty, otherwise letters only.
            validate: {
                validator: (v) => !v || NAME_RX.test(v),
                message: 'middle name can only contain letters',
            },
            maxlength: [40, 'middle name cannot be more than 40 characters'],
        },
        lastName: {
            type: String,
            required: [true, 'must provide last name'],
            trim: true,
            match: [NAME_RX, 'last name can only contain letters'],
            maxlength: [40, 'last name cannot be more than 40 characters'],
        },
        email: {
            type: String,
            required: [true, 'must provide email'],
            trim: true,
            lowercase: true,
            unique: true,
            match: [EMAIL_RX, 'please provide a valid email'],
            maxlength: [50, 'email cannot be more than 50 characters'],
        },
        phone: {
            type: String,
            required: [true, 'must provide phone number'],
            trim: true,
            unique: true,
            // Sparse so legacy rows without a phone don't collide on the unique index.
            sparse: true,
            match: [PHONE_RX, 'phone number must be exactly 10 digits'],
        },
        password: {
            type: String,
            required: [true, 'must provide password'],
            trim: true,
            maxlength: [120, 'password hash cannot be more than 120 characters'],
        },
        role: {
            // Stored as a string code ("01" patient, "02" doctor, "03" admin).
            type: String,
            trim: true,
            enum: { values: ROLE_CODES, message: 'invalid role' },
            default: ROLES.patient,
        },
    },
    // Auto-manages createdAt / updatedAt with the current date+time on every write.
    { timestamps: true }
);

module.exports = mongoose.model('Login', LoginSchema);
