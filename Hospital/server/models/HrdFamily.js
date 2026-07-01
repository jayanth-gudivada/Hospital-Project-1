const mongoose = require('mongoose');
const { GENDER_CODES } = require('../constants/genders');
const { RELATION_CODES } = require('../constants/relations');

// Field-format rules shared with the Login model / client validation.
const NAME_RX = /^[A-Za-z]+$/;                                       // letters only
const EMAIL_RX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/; // rejects commas/spaces etc.
const PHONE_RX = /^[0-9]{10}$/;                                      // exactly 10 digits

// A patient's family / dependants. Each row belongs to exactly one Login user via
// userId, which references Login.Id (the integer surrogate key, not the ObjectId).
// Ids here are assigned explicitly by the controller through getNextSequence
// ('hrdfamily'), so this collection has its own independent auto-increment sequence.
const HrdFamilySchema = new mongoose.Schema(
    {
        // Integer surrogate primary key (auto-increment, unique across the collection).
        Id: {
            type: Number,
            unique: true,
            sparse: true,
            index: true,
        },
        // Foreign key -> Login.Id (integer). Indexed for fast per-user lookups.
        userId: {
            type: Number,
            required: [true, 'userId is required'],
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
        // Optional for family members (they may not have their own email on record).
        email: {
            type: String,
            trim: true,
            lowercase: true,
            validate: {
                validator: (v) => !v || EMAIL_RX.test(v),
                message: 'please provide a valid email',
            },
            maxlength: [50, 'email cannot be more than 50 characters'],
        },
        // ISO-8601 string, same format as Login.dateOfBirth.
        dateOfBirth: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
            validate: {
                validator: (v) => !v || PHONE_RX.test(v),
                message: 'phone number must be exactly 10 digits',
            },
        },
        // Stored as a string code (see constants/genders.js).
        gender: {
            type: String,
            trim: true,
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
        // Stored as a string code (see constants/relations.js), same pattern as role.
        relation: {
            type: String,
            required: [true, 'must provide relation'],
            trim: true,
            enum: { values: RELATION_CODES, message: 'invalid relation' },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('HrdFamily', HrdFamilySchema);
