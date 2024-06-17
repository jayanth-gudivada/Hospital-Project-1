const mongoose = require('mongoose');


const LoginSchema = new mongoose.Schema({
    email: {
        type: String,
        requried: [true, 'must provide name'],
        trim: true,
        maxlength:[50,'name cannot be more than 50 characters']
    },
    password: {
        type: String,
        requried: [true, 'must provide password'],
        trim: true,
        maxlength:[20,'name cannot be more than 20 characters']
    },
});


module.exports = mongoose.model('Login', LoginSchema);