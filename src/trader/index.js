require('dotenv').config();

const db = require('db');
const UserHistoryCollector = require('./UserHistoryCollector');

db.connect();

UserHistoryCollector.collect();
setInterval(() => {
    UserHistoryCollector.collect();
}, 1000 * 60 * 60); // collect every 1 hour