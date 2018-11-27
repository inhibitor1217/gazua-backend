require('dotenv').config();

const {
    SOCKET_PORT: port
} = process.env;

const io = require('socket.io')();

io.listen(port);
console.log(`socket.io server is listening on port ${port}`);

// Detect DB update and emit to front-end clients for notification.
const db = require('db');
const CurrencyTicker = require('db/models/CurrencyTicker');
const currencyPairs = [
    'btc_krw', 'etc_krw', 'eth_krw', 'xrp_krw', 'bch_krw', 'ltc_krw'
];
db.connect();

const lastUpdated = {};
currencyPairs.forEach(async (currencyPair) => {
    try {
        const lastUpdatedTicker = await CurrencyTicker.findLastUpdated(currencyPair);
        lastUpdated[currencyPair] = lastUpdatedTicker[0].ticker.timestamp;
    } catch (e) {
        console.log(e);
    }
});
setInterval(() => {
    currencyPairs.forEach(async (currencyPair) => {
        try {
            const lastUpdatedTicker = await CurrencyTicker.findLastUpdated(currencyPair);
            const lastTimestamp = lastUpdatedTicker[0].ticker.timestamp;
            if (lastUpdated[currencyPair] !== lastTimestamp) {
                lastUpdated[currencyPair] = lastTimestamp;
                io.sockets.emit('ticker', currencyPair);
                console.log(`db update detected with currencyPair ${currencyPair}`);
            }
        } catch (e) {
            console.log(e);
        }
    });
}, 1000 * 60); // check every minute