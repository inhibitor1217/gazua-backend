const mongoose = require('mongoose');
const crypto = require('crypto');
const token = require('lib/token');
const { Schema } = mongoose;
const { PASSWORD_KEY: secret } = process.env;
const UserHistory = require('db/models/UserHistory');
const Ask = require('db/models/Ask');
const Bid = require('db/models/Bid');

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
        },
        history: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserHistoryModel'
        }],
        asks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ask'
        }],
        bids: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bid'
        }]
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
    return User.findOne({ email });
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
    return User.findById(user._id, { 'userdata.wallet': true });
};

User.retrieveLastHistory = (user) => {
    return User.findById(user._id, { 'userdata.history': true })
        .populate({
            path: 'userdata.history',
            options: {
                sort: { timestamp: -1 },
                limit: 1
            }
        })
        .then((user) => {
            if (!user) {
                return null;
            }
            return user.userdata.history;
        });
};

User.retrieveYesterdayHistory = (user) => {
    return User.findById(user._id, { 'userdata.history': true })
        .populate({
            path: 'userdata.history',
            match: {
                timestamp: { $lte: Date.now() - 1000 * 60 * 60 * 24 }
            },
            options: {
                sort: { timestamp: -1 },
                limit: 1
            }
        })
        .then((user) => {
            if (!user) {
                return null;
            }
            return user.userdata.history;
        });
};

User.retrieveAsks = (user, match, options) => {
    return User.findById(user._id, { 'userdata.asks': true })
        .populate({
            path: 'userdata.asks',
            match,
            options
        })
        .then((user) => {
            if (!user) {
                return null;
            }
            return user.userdata.asks;
        });
};

User.retrieveBids = (user, match, options) => {
    return User.findById(user._id, { 'userdata.bids': true })
        .populate({
            path: 'userdata.bids',
            match,
            options
        })
        .then((user) => {
            if (!user) {
                return null;
            }
            return user.userdata.bids;
        });
};

module.exports = User;