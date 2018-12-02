const Router = require('koa-router');

const trade = new Router();
const tradeControl = require('./trade.control');

trade.get('/ask', tradeControl.retrieveAsk);
trade.put('/ask/withdraw', tradeControl.withdrawAsk);
trade.post('/ask/register', tradeControl.registerAsk);
trade.get('/bid', tradeControl.retrieveBid);
trade.put('/bid/withdraw', tradeControl.withdrawBid);
trade.post('/bid/register', tradeControl.registerBid);

module.exports = trade;