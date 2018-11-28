const User = require('db/models/User');

exports.lastHistory = async (ctx) => {
    const { user } = ctx.request;

    if (!user) {
        ctx.status = 403;
        return;
    }

    try {
        const ret = await User.retrieveLastHistory(user);
        const userHistory = ret[0];
        ctx.body = { userHistory };
    } catch (e) {
        console.log(e);
        ctx.throw(500);
    }
};

exports.yesterdayHistory = async (ctx) => {
    const { user } = ctx.request;

    if (!user) {
        ctx.status = 403;
        return;
    }

    try {
        const ret = await User.retrieveYesterdayHistory(user);
        const userHistory = ret[0];
        ctx.body = { userHistory };
    } catch (e) {
        console.log(e);
        ctx.throw(500);
    }
};