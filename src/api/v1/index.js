const Router = require('koa-router');

const auth = require('./auth');
const ticker = require('./ticker');
const wallet = require('./wallet');
const history = require('./history');

const v1 = new Router();

v1.use('/auth', auth.routes());
v1.use('/ticker', ticker.routes());
v1.use('/wallet', wallet.routes());
v1.use('/history', history.routes());

module.exports = v1;