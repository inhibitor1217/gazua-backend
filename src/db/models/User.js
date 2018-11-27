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
        wallet: {
            krw: { type: Number, default: 1000000 },
            btc_krw: { type: Number, default: 0 },
            etc_krw: { type: Number, default: 0 },
            eth_krw: { type: Number, default: 0 },
            xrp_krw: { type: Number, default: 0 },
            bch_krw: { type: Number, default: 0 },
            ltc_krw: { type: Number, default: 0 },
            lastUpdated: {
                type: Date,
                default: Date.now
            }
        }
    }
});

/*
 * This middleware is not fired when using findOneAndUpdate, etc
 * Should use 'save'
 */
UserSchema.pre('save', function (next) {
    this.userdata.wallet.lastUpdated = Date.now();
    next();
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

User.retrieveWallet = (user) => {
    return User.findById(user._id, { 'userdata.wallet': true }).exec();
};

module.exports = User;