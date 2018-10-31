const mongoose = require('mongoose');
const { Schema } = mongoose;
const { PASSWORD_KEY: secret } = process.env;
const crypto = require('crypto');

function hash (password) {
    return crypto.createHmac('sha256', secret)
        .update(password)
        .digest('hex');
}

const UserSchema = new Schema({
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

const User = mongoose.model('User', UserSchema);

User.findByEmail = (email) => {
    return User.findOne({ email }).exec();
};

User.localRegister = ({ username, email, password }) => {
    const user = new User({
        username,
        email,
        password: hash(password)
    });
    return user.save();
};

module.exports = User;