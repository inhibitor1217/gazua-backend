const User = require('db/models/User');

exports.wallet = async (ctx) => {
    const { user } = ctx.request;

    if (!user) { /* User not logged in */
        ctx.status = 403;
        return;
    }

    try {
        ctx.body = await User.retrieveWallet(user);
    } catch (e) {
        ctx.throw(500);
        console.log(e);
    }
};