require('dotenv').config();

const User = require('db/models/User');
const Ask = require('db/models/Ask');
const Bid = require('db/models/Bid');
const axios = require('axios');
const { currencyPairs } = require('lib/constants');

const {
    KORBIT_URI: korbitURI
} = process.env;

module.exports = (function () {
    return {
        trade () {
            console.log('Simulating trade...');
            currencyPairs.forEach(async (currencyPair) => {
                const { data: transactions } = await axios.get(`${korbitURI}/transactions?currency_pair=${currencyPair}&time=minute`);
                const askRef = {};
                const bidRef = {};
                transactions.forEach(({ price, amount }) => {
                    if (!askRef[price]) {
                        askRef[price] = +amount;
                    } else {
                        askRef[price] += +amount;
                    }
                    if (!bidRef[price]) {
                        bidRef[price] = +amount;
                    } else {
                        bidRef[price] += +amount;
                    }
                });

                const asks = await Ask.retrievePending(currencyPair);
                for (let ask of asks) {
                    const { price, volume, completedVolume } = ask;
                    let remainingVolume = volume - completedVolume;
                    let transactVolume = remainingVolume;
                    const user = await User.findById(ask.issuer._id);
                    const { wallet } = user.userdata;
                    if (askRef[price] > 0) {
                        if (askRef[price] < transactVolume) {
                            transactVolume = askRef[price];
                        }
                        if (wallet[currencyPair] >= transactVolume) {
                            user.userdata.wallet[currencyPair] -= transactVolume;
                            user.userdata.wallet['krw'] += transactVolume * price;
                            askRef[price] -= transactVolume;
                            ask.completedVolume += transactVolume;
                            if (ask.completedVolume === ask.volume) {
                                ask.state = 'completed';
                            }
                            console.log(`ask transaction completed: ${user._id}, ${currencyPair}, ${price}, ${transactVolume}`);
                        } else {
                            transactVolume = wallet[currencyPair];
                            user.userdata.wallet[currencyPair] -= transactVolume;
                            user.userdata.wallet['krw'] += transactVolume * price;
                            askRef[price] -= transactVolume;
                            ask.state = 'warning';
                            ask.completedVolume += transactVolume;
                            if (ask.completedVolume === ask.volume) {
                                ask.state = 'completed';
                            }
                            console.log(`ask transaction completed with warning: ${user._id}, ${currencyPair}, ${price}, ${transactVolume}`);
                        }
                        await user.save();
                        await ask.save();
                    }
                }

                const bids = await Bid.retrievePending(currencyPair);
                for (let bid of bids) {
                    const { price, volume, completedVolume } = bid;
                    let remainingVolume = volume - completedVolume;
                    let transactVolume = remainingVolume;
                    const user = await User.findById(bid.issuer._id);
                    const { wallet } = user.userdata;
                    if (bidRef[price] > 0) {
                        if (bidRef[price] < transactVolume) {
                            transactVolume = bidRef[price];
                        }
                        if (wallet['krw'] >= transactVolume * price) {
                            user.userdata.wallet[currencyPair] += transactVolume;
                            user.userdata.wallet['krw'] -= transactVolume * price;
                            bidRef[price] -= transactVolume;
                            bid.completedVolume += transactVolume;
                            if (bid.completedVolume === bid.volume) {
                                bid.state = 'completed';
                            }
                            console.log(`bid transaction completed: ${user._id}, ${currencyPair}, ${price}, ${transactVolume}`);
                        } else {
                            transactVolume = wallet['krw'] / price;
                            user.userdata.wallet[currencyPair] += transactVolume;
                            user.userdata.wallet['krw'] -= transactVolume * price;
                            bidRef[price] -= transactVolume;
                            bid.state = 'warning';
                            bid.completedVolume += transactVolume;
                            if (bid.completedVolume === bid.volume) {
                                bid.state = 'completed';
                            }
                            console.log(`bid transaction completed with warning: ${user._id}, ${currencyPair}, ${price}, ${transactVolume}`);
                        }
                        await user.save();
                        await bid.save();
                    }
                }
            });
        }
    };
})();