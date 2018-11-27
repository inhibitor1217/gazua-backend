const Router = require('koa-router');
const auth = require('./auth');
const ticker = require('./ticker');
const wallet = require('./wallet');

const v1 = new Router();

v1.use('/auth', auth.routes());
v1.use('/ticker', ticker.routes());
v1.use('/wallet', wallet.routes());

module.exports = v1;