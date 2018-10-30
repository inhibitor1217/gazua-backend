const {
    MONGO_URI: mongoURI
} = process.env;

const mongoose = require('mongoose');

module.exports = (function () {
    mongoose.promise = global.Promise; /* To use ES6 promise */
    return {
        connect () {
            mongoose.connect(mongoURI, {
                useNewUrlParser: true
            }).then(
                () => {
                    console.log('connected to mongodb');
                }
            ).catch(e => {
                console.error(e);
            });
        }
    };
})();