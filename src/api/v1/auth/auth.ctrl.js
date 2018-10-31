const Joi = require('joi');
const User = require('db/models/User');
const token = require('lib/token');

exports.localRegister = async (ctx) => {
    const { body } = ctx.request;

    const schema = Joi.object({
        username: Joi.string().regex(/^[a-zA-Z0-9]{3,12}$/).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(30)
    });

    const result = Joi.validate(body, schema);

    if (result.error) { /* Schema Error */
        ctx.status = 400;
        return;
    }

    const { username, email, password } = body;

    try {
        const emailExists = await User.findByEmail(email);
        if (emailExists) {
            ctx.status = 400;
            ctx.body = {
                message: 'email already exists'
            };
            return;
        }

        const user = await User.localRegister({
            username, email, password
        });

        ctx.body = user;
        const accessToken = await token.generateToken({
            user: {
                _id: user._id,
                username: user.username
            }
        }, 'user');

        ctx.cookies.set('access_token', accessToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
        });
    } catch (e) {
        ctx.throw(500);
    }
};