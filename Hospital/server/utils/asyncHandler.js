// Wraps an async route handler so any rejected promise is forwarded to the
// centralized error middleware, removing the need for try/catch in every controller.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
