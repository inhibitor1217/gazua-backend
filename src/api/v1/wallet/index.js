const Router = require('koa-router');

const wallet = new Router();
const walletControl = require('./wallet.control');

wallet.get('/', walletControl.wallet);

module.exports = wallet;