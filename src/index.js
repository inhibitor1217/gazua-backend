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

/* configure CORS issue */
app.use((ctx, next) => {
    const whiteList = [
        'localhost'
    ];
    const origin = ctx.header['origin'];
    whiteList.every(el => {
        if (!origin) return false;
        if (origin.indexOf(el) !== -1) {
            ctx.response.set('Access-Control-Allow-Origin', origin);
            return false;
        }
        return true;
    });
    ctx.set('Access-Control-Allow-Credentials', true);
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-timebase, Link');
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, OPTIONS');
    ctx.set('Access-Control-Expose-Headers', 'Link');
    return next();
});

app.use(bodyParser());
app.use(jwtMiddleware);
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
    console.log(`gazua server is listening to port ${port}`);
});
