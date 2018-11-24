require('dotenv').config();

const {
    KORBIT_URI: korbitURI
} = process.env;

const db = require('db');
const axios = require('axios');
const CurrencyTicker = require('db/models/CurrencyTicker');

db.connect();

const currencyPairs = [
    'btc_krw', 'etc_krw', 'eth_krw', 'xrp_krw', 'bch_krw', 'ltc_krw'
];

const retrieveTicker = async (currencyPair) => {
    try {
        const { data: ticker } = await axios.get(korbitURI + '/ticker/detailed', {
            params: {
                currency_pair: currencyPair
            }
        });
        await CurrencyTicker.saveTicker(currencyPair, ticker);
    } catch (error) {
        console.log(error);
    }
};

const tickerLoop = setInterval(() => {
    currencyPairs.forEach((currencyPair) => retrieveTicker(currencyPair));
}, 60 * 1000);