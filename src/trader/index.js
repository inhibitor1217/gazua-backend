require('dotenv').config();

const db = require('db');
const UserHistoryCollector = require('./UserHistoryCollector');
const Trader = require('./Trader');

db.connect();

UserHistoryCollector.collect();
setInterval(() => {
    UserHistoryCollector.collect();
}, 1000 * 60 * 60); // collect every 1 hour

Trader.trade();
setInterval(() => {
    Trader.trade();
}, 1000 * 60); // trade every 1 minute