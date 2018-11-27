const User = require('db/models/User');
const CurrencyTicker = require('db/models/CurrencyTicker');
const UserHistory = require('db/models/UserHistory');

module.exports = (function () {
    const addHistoryForUser = (tickers) => async (user) => {
        const { wallet } = user.userdata;
        const { lastUpdated, krw, ...currencies } = wallet;
        let total = krw;
        for (let currencyPair in tickers) {
            total += tickers[currencyPair] * currencies[currencyPair];
        }
        const userHistory = new UserHistory({
            krw,
            btc_krw: currencies.btc_krw,
            etc_krw: currencies.etc_krw,
            eth_krw: currencies.eth_krw,
            xrp_krw: currencies.xrp_krw,
            bch_krw: currencies.bch_krw,
            ltc_krw: currencies.ltc_krw,
            total
        });
        const { _id } = await userHistory.save();
        user.userdata.history.push(_id);
        await user.save();
    };

    return {
        async collect () {
            const currencyPairs = [
                'btc_krw', 'etc_krw', 'eth_krw',
                'xrp_krw', 'bch_krw', 'ltc_krw'
            ];
            const tickers = {};
            for (let currencyPair of currencyPairs) {
                const ticker = await CurrencyTicker.findRecentTicker(currencyPair);
                tickers[currencyPair] = ticker[0].ticker.last;
            }
            try {
                await User.find()
                    .then((users) => {
                        users.forEach(addHistoryForUser(tickers));
                    });
            } catch (e) {
                console.log(e);
            }
        }
    };
})();