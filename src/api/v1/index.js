const Router = require('koa-router');
const auth = require('./auth');
const ticker = require('./ticker');

const v1 = new Router();

v1.use('/auth', auth.routes());
v1.use('/ticker', ticker.routes());

module.exports = v1;