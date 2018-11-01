require('dotenv').config();

const {
    PORT: port
} = process.env;

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const api = require('./api');
const db = require('./db');
const jwtMiddleware = require('lib/middlewares/jwtMiddleware');

db.connect();

const router = new Router();
router.use('/api', api.routes());

const app = new Koa();
app.use(jwtMiddleware);
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
    console.log(`gazua server is listening to port ${port}`);
});
