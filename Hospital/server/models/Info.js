const mongoose = require('mongoose');

// Same collection as the legacy app ("infos"), so existing hospital data is reused.
const InfoSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'must provide name'],
            trim: true,
            maxlength: [50, 'name cannot be more than 50 characters'],
        },
        location: {
            type: String,
            required: [true, 'must provide location'],
            trim: true,
            maxlength: [50, 'location cannot be more than 50 characters'],
        },
        address: {
            type: String,
            required: [true, 'must provide address'],
            trim: true,
            maxlength: [120, 'address cannot be more than 120 characters'],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Info', InfoSchema);
