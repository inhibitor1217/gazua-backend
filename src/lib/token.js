const jwt = require('jsonwebtoken');
const { JWT_KEY: secret } = process.env;

function generateToken (payload, subject) {
    return new Promise(
        (resolve, reject) => {
            jwt.sign(payload, secret, {
                expiresIn: '7d',
                issuer: 'gazua.com',
                subject
            }, (err, token) => {
                if (err) {
                    reject(err);
                }
                resolve(token);
            });
        }
    );
}

module.exports.generateToken = generateToken;