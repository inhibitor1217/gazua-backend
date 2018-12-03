const User = require('db/models/User');
const Ask = require('db/models/Ask');
const Bid = require('db/models/Bid');
const { currencyPairs, orderCondition } = require('lib/constants');

exports.retrieveAsk = async (ctx) => {
    const { user, query } = ctx.request;
    const {
        states: _states,
        currencyPairs: _currencyPairs,
        limit
    } = query;
    if (!_states || !_currencyPairs) {
        ctx.status = 400;
        return;
    }
    const states = JSON.parse(_states);
    const currencyPairs = JSON.parse(_currencyPairs);
    if (states.length === 0 || currencyPairs.length === 0) {
        ctx.body = [];
        return;
    }

    if (!user) {
        ctx.status = 403;
        return;
    }

    try {
        const asks = await User.retrieveAsks(user, {
            $and: [
                {
                    $or: states.map((state) => {
                        return { state };
                    })
                },
                {
                    $or: currencyPairs.map((currencyPair) => {
                        return { currencyPair };
                    })
                }
            ]
        }, {
            sort: { timestamp: -1 },
            limit
        });

        ctx.body = asks;
    } catch (e) {
        console.log(e);
        ctx.throw(500);
    }
};

exports.withdrawAsk = async (ctx) => {
    const { user, query } = ctx.request;
    const { ask_id: askID } = query;

    if (!user) {
        ctx.status = 403;
        return;
    }

    try {
        const ask = await Ask.findById(askID);
        if (!ask) {
            ctx.status = 400;
            ctx.body = { message: 'invalid ask id' };
            return;
        }
        if (user._id.toString() !== ask.issuer.toString()) {
            ctx.status = 403;
            return;
        }
        if (ask.state !== 'pending') {
            ctx.status = 400;
            ctx.body = { message: 'invalid ask state' };
            return;
        }
        await Ask.withdraw(ask);
        ctx.status = 204;
    } catch (e) {
        console.log(e);
        ctx.throw(500);
    }
};

exports.registerAsk = async (ctx) => {
    const { user, body } = ctx.request;
    if (!user) {
        ctx.status = 403;
        return;
    }

    const { currencyPair, price, volume } = body;
    if (!currencyPair || !currencyPairs.includes(currencyPair)) {
        ctx.status = 400;
        ctx.body = { message: 'invalid currency pair' };
        return;
    }
    if (!price ||
            price < orderCondition[currencyPair].min_price ||
            price > orderCondition[currencyPair].max_price ||
            Math.floor(price / orderCondition[currencyPair].tick_size) !== price / orderCondition[currencyPair].tick_size) {
        ctx.status = 400;
        ctx.body = { message: 'invalid price' };
        return;
    }
    if (!volume ||
            volume < orderCondition[currencyPair].order_min_size ||
            volume > orderCondition[currencyPair].order_max_size) {
        ctx.status = 400;
        ctx.body = { message: 'invalid volume' };
        return;
    }

    try {
        const _user = await User.findById(user._id);
        if (!_user) {
            ctx.status = 403;
            return;
        }

        const askData = {
            issuer: user._id,
            currencyPair,
            price,
            volume
        };
        const ask = await Ask.register(askData);
        _user.userdata.asks.push(ask._id);
        _user.save();

        ctx.body = ask;
    } catch (e) {
        console.log(e);
        ctx.throw(500);
    }
};

exports.retrieveBid = async (ctx) => {
    const { user, query } = ctx.request;
    const {
        states: _states,
        currencyPairs: _currencyPairs,
        limit
    } = query;
    if (!_states || !_currencyPairs) {
        ctx.status = 400;
        return;
    }
    const states = JSON.parse(_states);
    const currencyPairs = JSON.parse(_currencyPairs);
    if (states.length === 0 || currencyPairs.length === 0) {
        ctx.body = [];
        return;
    }

    if (!user) {
        ctx.status = 403;
        return;
    }

    try {
        const asks = await User.retrieveBids(user, {
            $and: [
                {
                    $or: states.map((state) => {
                        return { state };
                    })
                },
                {
                    $or: currencyPairs.map((currencyPair) => {
                        return { currencyPair };
                    })
                }
            ]
        }, {
            sort: { timestamp: -1 },
            limit
        });

        ctx.body = asks;
    } catch (e) {
        console.log(e);
        ctx.throw(500);
    }
};

exports.withdrawBid = async (ctx) => {
    const { user, query } = ctx.request;
    const { bid_id: bidID } = query;

    if (!user) {
        ctx.status = 403;
        return;
    }

    try {
        const bid = await Bid.findById(bidID);
        if (!bid) {
            ctx.status = 400;
            return;
        }
        if (user._id.toString() !== bid.issuer.toString()) {
            ctx.status = 403;
            return;
        }
        if (bid.state !== 'pending') {
            ctx.status = 400;
            return;
        }
        await Bid.withdraw(bid);
    } catch (e) {
        console.log(e);
        ctx.throw(500);
    }
};

exports.registerBid = async (ctx) => {
    const { user, body } = ctx.request;
    if (!user) {
        ctx.status = 403;
        return;
    }

    const { currencyPair, price, volume } = body;
    if (!currencyPair || !currencyPairs.includes(currencyPair)) {
        ctx.status = 400;
        ctx.body = { message: 'invalid currency pair' };
        return;
    }
    if (!price ||
            price < orderCondition[currencyPair].min_price ||
            price > orderCondition[currencyPair].max_price ||
            Math.floor(price / orderCondition[currencyPair].tick_size) !== price / orderCondition[currencyPair].tick_size) {
        ctx.status = 400;
        ctx.body = { message: 'invalid price' };
        return;
    }
    if (!volume ||
            volume < orderCondition[currencyPair].order_min_size ||
            volume > orderCondition[currencyPair].order_max_size) {
        ctx.status = 400;
        ctx.body = { message: 'invalid volume' };
        return;
    }

    try {
        const _user = await User.findById(user._id);
        if (!_user) {
            ctx.status = 403;
            return;
        }

        const bidData = {
            issuer: user._id,
            currencyPair,
            price,
            volume
        };
        const bid = await Bid.register(bidData);
        _user.userdata.bids.push(bid._id);
        _user.save();

        ctx.body = bid;
    } catch (e) {
        console.log(e);
        ctx.throw(500);
    }
};