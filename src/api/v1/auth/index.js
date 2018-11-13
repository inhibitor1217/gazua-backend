const Router = require('koa-router');

const auth = new Router();
const authControl = require('./auth.control');

auth.get('/', (ctx) => {
    ctx.body = 'auth';
});

auth.post('/register/local', authControl.localRegister);
auth.post('/login/local', authControl.localLogin);
auth.get('/check', authControl.check);
auth.get('/check-email', authControl.checkByEmail);

module.exports = auth;