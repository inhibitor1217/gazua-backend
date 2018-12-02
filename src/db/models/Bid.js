const mongoose = require('mongoose');
const { Schema } = mongoose;
const { currencyPairs, orderCondition } = require('lib/constants');

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
    const { currencyPair, price, volume } = bid;
    if (!currencyPair || !currencyPairs.includes(bid.currencyPair)) {
        throw new Error('invalid currency pair');
    }
    if (!price ||
            price < orderCondition[currencyPair].min_price ||
            price > orderCondition[currencyPair].max_price ||
            Math.floor(price / orderCondition[currencyPair].tick_size) === price / orderCondition[currencyPair].tick_size) {
        throw new Error('invalid price');
    }
    if (!volume ||
            volume < orderCondition[currencyPair].order_min_size ||
            volume > orderCondition[currencyPair].order_max_size) {
        throw new Error('invalid volume');
    }
    return new Bid(Bid).save();
};

Bid.withdraw = (bid) => {
    Bid.findById(bid._id)
        .then((bid) => {
            if (bid.state !== 'withdrawn') {
                bid.state = 'withdrawn';
                bid.save();
            }
        });
};

Bid.retrievePending = () => {
    return Bid.find({ state: 'pending' })
        .sort({ timestamp: +1 });
};

module.exports = Bid;