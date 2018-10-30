const Joi = require('joi');
const User = require('db/models/User');

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
    } catch (e) {
        ctx.throw(500);
    }
};