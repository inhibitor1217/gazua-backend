const mongoose = require('mongoose');
const { Schema } = mongoose;
const { currencyPairs } = require('lib/constants');

const CurrencyTickerSchema = new Schema({
    currencyPair: String,
    ticker: {
        timestamp: Number,
        last: Number,
        bid: Number,
        ask: Number,
        low: Number,
        high: Number,
        volume: Number,
        change: Number,
        changePercent: Number
    }
});

const CurrencyTicker = mongoose.model('Currency', CurrencyTickerSchema);

CurrencyTicker.saveTicker = (currencyPair, ticker) => {
    if (!currencyPairs.includes(currencyPair)) {
        throw (new Error('invalid currency pair'));
    }
    CurrencyTicker.findOne({ currencyPair, 'ticker.timestamp': ticker.timestamp })
        .then((currencyTicker) => {
            if (!currencyTicker) {
                const newCurrencyTicker = new CurrencyTicker({
                    currencyPair, ticker
                });
                newCurrencyTicker.save();
                console.log(`Updated ticker: ${currencyPair}, ${new Date().toTimeString()}`);
            }
        })
        .catch((err) => {
            throw (err);
        });
};

CurrencyTicker.findLastUpdated = (currencyPair) => {
    if (!currencyPairs.includes(currencyPair)) {
        throw (new Error('invalid currency pair'));
    }
    return CurrencyTicker.find(
        { currencyPair },
        { 'ticker.timestamp': true }
    ).sort({ 'ticker.timestamp': -1 }).limit(1);
};

CurrencyTicker.findRecentTicker = (currencyPair) => {
    if (!currencyPairs.includes(currencyPair)) {
        throw (new Error('invalid currency pair'));
    }
    return CurrencyTicker.find(
        { currencyPair },
        { _id: false, __v: false }
    ).sort({ 'ticker.timestamp': -1 }).limit(1);
};

CurrencyTicker.findRecentTickersWithInterval = (currencyPair, timeQuery) => {
    if (!currencyPairs.includes(currencyPair)) {
        throw (new Error('invalid currency pair'));
    }
    return CurrencyTicker.find(
        {
            currencyPair,
            'ticker.timestamp': { $gte: Date.now() - timeQuery }
        },
        { ticker: true, _id: false })
        .sort({ 'ticker.timestamp': +1 });
};

module.exports = CurrencyTicker;