const mongoose = require('mongoose');
const { Schema } = mongoose;
const { currencyPairs, orderCondition } = require('lib/constants');

const AskSchema = new Schema({
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

const Ask = mongoose.model('Ask', AskSchema);

Ask.register = (ask) => {
    const { currencyPair, price, volume } = ask;
    if (!currencyPair || !currencyPairs.includes(ask.currencyPair)) {
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
    return new Ask(ask).save();
};

Ask.withdraw = (ask) => {
    Ask.findById(ask._id)
        .then((ask) => {
            if (ask.state !== 'withdrawn') {
                ask.state = 'withdrawn';
                ask.save();
            }
        });
};

Ask.retrievePending = () => {
    return Ask.find({ state: 'pending' })
        .sort({ timestamp: +1 });
};

module.exports = Ask;