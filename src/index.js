require('dotenv').config();

const {
    PORT: port
} = process.env;

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const api = require('./api');
const db = require('./db');

db.connect();

const app = new Koa();
const router = new Router();
router.use('/api', api.routes());

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
    console.log(`gazua server is listening to port ${port}`);
});
