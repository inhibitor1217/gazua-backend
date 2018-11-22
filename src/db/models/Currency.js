const mongoose = require('mongoose');
const { Schema } = mongoose;

const CurrencySchema = new Schema({
    general: {
        timestamp: Number,
        last: Number,
        bid: Number,
        ask: Number,
        low: Number,
        high: Number,
        volume: Number
    },
    orderbook: {
        timestamp: Number,
        asks: [{
            price: Number,
            volume: Number
        }],
        bids: [{
            price: Number,
            volume: Number
        }]
    },
    transactions: [{
        timestamp: Number,
        tid: Number,
        price: Number,
        amount: Number
    }]
});

const Currency = mongoose.model('Currency', CurrencySchema);

// DB CRUD functions

module.exports = Currency;