const { generateToken, decodeToken } = require('lib/token');

module.exports = async (ctx, next) => {
    const token = ctx.cookies.get('access_token');

    if (!token) {
        ctx.request.user = null;
        return next();
    }

    try {
        const decoded = await decodeToken(token);
        const { user } = decoded;

        // re-issue token when the age of token is over 3 days
        if (Date.now() / 1000 - decoded.iat > 60 * 60 * 24 * 3) {
            const newToken = await generateToken({ user }, 'User');
            ctx.cookies.set('access_token', newToken, {
                maxAge: 1000 * 60 * 60 * 24 * 7
            });
        }

        ctx.request.user = user;
    } catch (e) {
        ctx.request.user = null;
    }

    return next();
};