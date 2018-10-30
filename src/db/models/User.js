const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = new Schema({
    username: String,
    email: String,
    password: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    social: {
        google: {
            id: String,
            accessToken: String
        }
    }
});

module.exports = mongoose.model('User', User);