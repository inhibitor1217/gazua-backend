const Router = require('koa-router');

const ticker = new Router();
const tickerControl = require('./ticker.control');

ticker.get('/', tickerControl.ticker);

module.exports = ticker;