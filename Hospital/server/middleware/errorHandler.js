// Centralized error responder: catches anything passed to next(err) and maps it
// to a consistent JSON shape, so controllers stay free of try/catch boilerplate.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    // Mongoose schema validation failed -> surface the first field message as 400.
    if (err.name === 'ValidationError') {
        const first = Object.values(err.errors)[0];
        return res.status(400).json({ msg: first ? first.message : 'Validation failed' });
    }

    // Duplicate key on a unique index (email or phone) -> 409 Conflict.
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0];
        const label = field === 'phone' ? 'phone number' : 'email';
        return res.status(409).json({ msg: `A user with that ${label} already exists` });
    }

    console.error(err);
    return res.status(500).json({ msg: 'Server error', error: err.message });
}

module.exports = errorHandler;
