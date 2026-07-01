const mongoose = require('mongoose');

// One document per named sequence (e.g. "login", "hrdfamily") holding the last
// integer handed out. MongoDB has no native AUTO_INCREMENT, so we emulate it with
// this collection and an atomic $inc (see utils/sequence.js). The sequence name is
// the document _id, which keeps lookups a primary-key hit.
const CounterSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true }, // sequence name
        seq: { type: Number, default: 0 },
    },
    { versionKey: false }
);

module.exports = mongoose.model('Counter', CounterSchema);
