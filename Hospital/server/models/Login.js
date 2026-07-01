const mongoose = require('mongoose');
const { ROLE_CODES, ROLES } = require('../constants/roles');
const { GENDER_CODES } = require('../constants/genders');
const getNextSequence = require('../utils/sequence');

// Field-format rules reused by validation.
const NAME_RX = /^[A-Za-z]+$/;                                       // letters only
const EMAIL_RX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/; // rejects commas/spaces etc.
const PHONE_RX = /^[0-9]{10}$/;                                      // exactly 10 digits

// Same collection as the legacy app ("logins"), so existing admin accounts are reused.
// NOTE: legacy rows store plaintext passwords. The auth controller transparently
// upgrades them to bcrypt hashes on the next successful login (see authController).
const LoginSchema = new mongoose.Schema(
    {
        // Integer surrogate key (auto-increment). MongoDB keeps _id (an ObjectId)
        // as the physical primary key; this is the human-friendly integer id the
        // app references — e.g. HrdFamily.userId points at this value. Assigned by
        // the pre-save hook below; backfilled for legacy rows by scripts/migrateIds.js.
        // sparse so legacy rows not yet migrated don't collide on the unique index.
        Id: {
            type: Number,
            unique: true,
            sparse: true,
            index: true,
        },
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
        // ----- Extended profile (collected on the patient Profile screen) -----
        // Date of birth stored as an ISO-8601 string (e.g. "1990-05-15T00:00:00.000Z").
        dateOfBirth: {
            type: String,
            trim: true,
        },
        // Stored as a string code (see constants/genders.js), same pattern as role.
        gender: {
            type: String,
            trim: true,
            // Optional; allow empty, otherwise must be a known gender code.
            validate: {
                validator: (v) => !v || GENDER_CODES.includes(v),
                message: 'invalid gender',
            },
        },
        address: {
            type: String,
            trim: true,
            maxlength: [200, 'address cannot be more than 200 characters'],
        },
        // Profile-completion gate. 1 = the user has not filled their profile yet and
        // must be prompted to before using the portal; flipped to 0 on the first
        // successful Profile-screen save. New users start at 1; pre-existing users are
        // backfilled to 0 by scripts/migrateProfileFill.js.
        profileFill: {
            type: Number,
            enum: [0, 1],
            default: 1,
        },
    },
    // Auto-manages createdAt / updatedAt with the current date+time on every write.
    { timestamps: true }
);

// Emulate AUTO_INCREMENT: hand out the next integer Id for brand-new documents.
// Runs on Login.create()/save(); legacy rows are backfilled by the migration script.
LoginSchema.pre('save', async function assignId(next) {
    if (this.isNew && (this.Id === undefined || this.Id === null)) {
        this.Id = await getNextSequence('login');
    }
    next();
});

module.exports = mongoose.model('Login', LoginSchema);
