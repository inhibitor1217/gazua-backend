const Joi = require('joi');
const User = require('db/models/User');

exports.localRegister = async (ctx) => {
    const { body } = ctx.request;

    const schema = Joi.object({
        username: Joi.string().min(2).max(30).required(),
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
            ctx.status = 409;
            ctx.body = {
                message: 'email already exists'
            };
            return;
        }

        const user = await User.localRegister({
            username, email, password
        });

        ctx.body = {
            _id: user._id,
            username: user.username,
            email: user.email
        };
    } catch (e) {
        ctx.throw(500);
    }
};

exports.localLogin = async (ctx) => {
    const { body } = ctx.request;

    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    const result = Joi.validate(body, schema);

    if (result.error) { /* Schema Error */
        ctx.status = 400;
        if (result.error.toString().includes('email')) {
            ctx.body = {
                message: 'email schema error'
            };
        }
        return;
    }

    const { email, password } = body;

    try {
        const user = await User.findByEmail(email);
        if (!user) { /* Cannot find user with given email */
            ctx.status = 403;
            ctx.body = {
                message: 'user does not exist'
            };
            return;
        }
        if (user.verify(password)) {
            ctx.body = {
                _id: user._id,
                username: user.username,
                email: user.email
            };
            const accessToken = await user.generateToken();
            ctx.cookies.set('access_token', accessToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 7
            });
        } else { /* Wrong password */
            ctx.status = 403;
            ctx.body = {
                message: 'wrong password'
            };
        }
    } catch (e) {
        ctx.throw(500);
    }
};

exports.check = (ctx) => {
    const { user } = ctx.request;

    if (!user) { /* accessToken not verified */
        ctx.status = 403;
        return;
    }

    ctx.body = {
        user
    };
};

exports.checkByEmail = async (ctx) => {
    const { email } = ctx.request.query;

    if (!email) {
        ctx.status = 400;
        return;
    }

    const emailExists = await User.findByEmail(email);
    ctx.body = {
        message: emailExists ? 'user exists' : 'user does not exist'
    };
};