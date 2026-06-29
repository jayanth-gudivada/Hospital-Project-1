const mongoose = require('mongoose');

// Opens the shared MongoDB connection used by every model.
const connectDB = (url) => mongoose.connect(url);

module.exports = connectDB;
