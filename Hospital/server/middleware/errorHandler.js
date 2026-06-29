// Centralized error responder: catches anything passed to next(err) and returns
// a single consistent 500 shape, so controllers stay free of try/catch boilerplate.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
}

module.exports = errorHandler;
