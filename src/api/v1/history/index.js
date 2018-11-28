const Router = require('koa-router');

const history = new Router();
const historyControl = require('./history.control');

history.get('/', (ctx) => {
    ctx.body = 'history';
});

history.get('/last', historyControl.lastHistory);
history.get('/yesterday', historyControl.yesterdayHistory);

module.exports = history;