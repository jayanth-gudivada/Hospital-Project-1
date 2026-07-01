const Counter = require('../models/Counter');

// Atomically increments the named counter and returns the new integer. The
// findOneAndUpdate is a single atomic op, so concurrent inserts never collide
// on the same value — this is our stand-in for a SQL AUTO_INCREMENT column.
async function getNextSequence(name) {
    const counter = await Counter.findByIdAndUpdate(
        name,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return counter.seq;
}

module.exports = getNextSequence;
