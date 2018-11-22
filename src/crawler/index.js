require('dotenv').config();

const {
    KORBIT_URI: korbitURI
} = process.env;

const db = require('db');
const axios = require('axios');
const CurrencyTicker = require('db/models/CurrencyTicker');

db.connect();

const retrieveTicker = async (currencyPair) => {
    console.log('Retrieving data for currency ' + currencyPair);
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
    retrieveTicker('btc_krw');
}, 20 * 1000);