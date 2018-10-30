const Router = require('koa-router');
const auth = require('./auth');

const v1 = new Router();

v1.use('/auth', auth.routes());

module.exports = v1;