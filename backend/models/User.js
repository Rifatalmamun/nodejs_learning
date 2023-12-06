const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'I am new'
    },
    password: {
        type: String,
        required: true
    },
    feeds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Feed'
        }
    ]
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);