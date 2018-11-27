const User = require('db/models/User');

exports.wallet = async (ctx) => {
    const { user } = ctx.request;

    if (!user) { /* User not logged in */
        ctx.status = 403;
        return;
    }

    ctx.body = await User.retrieveWallet(user);
};