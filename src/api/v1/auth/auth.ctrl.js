const Joi = require('joi');

exports.localRegister = async (ctx) => {
    const { body } = ctx.request;

    const schema = {
        username: Joi.string().regex(/^[a-zA-Z0-9]{3, 12}$/).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(30)
    };

    const result = Joi.validate(body, schema);

    if (!result.error) { /* Schema Error */
        ctx.status = 400;
        return;
    }

    ctx.body = body;
};