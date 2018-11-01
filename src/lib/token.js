const jwt = require('jsonwebtoken');
const { JWT_KEY: secret } = process.env;

function generateToken (payload, subject) {
    return new Promise(
        (resolve, reject) => {
            jwt.sign(payload, secret, {
                expiresIn: '7d',
                issuer: 'gazua.com',
                subject
            }, (error, token) => {
                if (error) {
                    reject(error);
                }
                resolve(token);
            });
        }
    );
}

function decodeToken (token) {
    return new Promise(
        (resolve, reject) => {
            jwt.verify(token, secret, (error, decoded) => {
                if (error) reject(error);
                resolve(decoded);
            });
        }
    );
}

exports.generateToken = generateToken;
exports.decodeToken = decodeToken;