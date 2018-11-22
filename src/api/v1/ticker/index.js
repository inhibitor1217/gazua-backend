const Router = require('koa-router');

const ticker = new Router();
const tickerControl = require('./ticker.control');

ticker.get('/', (ctx) => {
    ctx.body = 'ticker';
});

module.exports = ticker;