const mongoose = require('mongoose');


const InfoSchema = new mongoose.Schema({
    name: {
        type: String,
        requried: [true, 'must provide name'],
        trim: true,
        maxlength:[50,'name cannot be more than 50 characters']
    },
    location: {
        type: String,
        requried: [true, 'must provide name'],
        trim: true,
        maxlength:[20,'name cannot be more than 20 characters']
    },
    address: {
        type: String,
        requried: [true, 'must provide name'],
        trim: true,
        maxlength:[50,'name cannot be more than 50 characters']
    },
});


module.exports = mongoose.model('Info', InfoSchema);