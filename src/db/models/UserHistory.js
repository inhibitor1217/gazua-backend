const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserHistorySchema = new Schema({
    krw: Number,
    btc_krw: Number,
    etc_krw: Number,
    eth_krw: Number,
    xrp_krw: Number,
    bch_krw: Number,
    ltc_krw: Number,
    total: Number,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const UserHistory = mongoose.model('UserHistoryModel', UserHistorySchema);

UserHistory.addHistory = (userHistory) => {
    return new UserHistory(userHistory).save();
};

module.exports = UserHistory;