const mongoose = require('mongoose');
const crypto = require('crypto');
const token = require('lib/token');
const { Schema } = mongoose;
const { PASSWORD_KEY: secret } = process.env;

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
    },
    userdata: {
        wallet: Number
    }
});

UserSchema.methods.verify = function (password) {
    const hashed = hash(password);
    return this.password === hashed;
};

UserSchema.methods.generateToken = function () {
    return token.generateToken({
        user: {
            _id: this._id,
            username: this.username
        }
    }, 'User');
};

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