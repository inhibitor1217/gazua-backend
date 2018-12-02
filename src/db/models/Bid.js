const mongoose = require('mongoose');
const { Schema } = mongoose;

const BidSchema = new Schema({
    issuer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    currencyPair: String,
    price: Number,
    volume: Number,
    completedVolume: {
        type: Number,
        default: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    state: {
        type: String,
        default: 'pending'
    } // 'pending' | 'completed' | 'withdrawn'
});

const Bid = mongoose.model('Bid', BidSchema);

Bid.register = (bid) => {
    return new Bid(bid).save();
};

Bid.withdraw = (bid) => {
    if (bid && bid.state === 'pending') {
        bid.state = 'withdrawn';
        return bid.save();
    }
};

Bid.retrievePending = () => {
    return Bid.find({ state: 'pending' })
        .sort({ timestamp: +1 });
};

module.exports = Bid;