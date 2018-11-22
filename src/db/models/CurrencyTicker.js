const mongoose = require('mongoose');
const { Schema } = mongoose;

const validCurrencyPairs = [
    'btc_krw', 'etc_krw', 'eth_krw', 'xrp_krw', 'bch_krw', 'ltc_krw'
];

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
    if (!validCurrencyPairs.includes(currencyPair)) {
        throw (new Error('invalid currency pair'));
    }
    CurrencyTicker.findOne({ currencyPair, 'ticker.timestamp': ticker.timestamp })
        .then((currencyTicker) => {
            if (!currencyTicker) {
                const newCurrencyTicker = new CurrencyTicker({
                    currencyPair, ticker
                });
                newCurrencyTicker.save();
            }
        })
        .catch((err) => {
            throw (err);
        });
};

module.exports = CurrencyTicker;