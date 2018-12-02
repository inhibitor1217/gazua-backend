const CurrencyTicker = require('db/models/CurrencyTicker');

exports.ticker = async (ctx) => {
    const { currencyPair, timeInterval } = ctx.request.query;

    if (!currencyPair) { // currencyPair is a required field
        ctx.status = 400;
        return;
    }

    try {
        if (!timeInterval) {
            // Get most recent ticker
            ctx.body = await CurrencyTicker.findRecentTicker(currencyPair);
        } else {
            switch (timeInterval.toLowerCase()) {
            case '6h':
            case '6hour':
            case '6hours':
                // retrieve data for 6 hours
                ctx.body = await CurrencyTicker
                    .findRecentTickersWithInterval(
                        currencyPair, 1000 * 60 * 60 * 6
                    );
                break;
            case 'd':
            case '1d':
            case 'day':
                // retrieve data for 1 day
                ctx.body = await CurrencyTicker
                    .findRecentTickersWithInterval(
                        currencyPair, 1000 * 60 * 60 * 24
                    );
                break;
            case 'w':
            case '1w':
            case '7d':
            case 'week':
                // retrieve data for 1 week
                ctx.body = await CurrencyTicker
                    .findRecentTickersWithInterval(
                        currencyPair, 1000 * 60 * 60 * 24 * 7
                    );
                break;
            case 'm':
            case '1m':
            case '30d':
            case 'month':
                // retrieve data for 1 month
                ctx.body = await CurrencyTicker
                    .findRecentTickersWithInterval(
                        currencyPair, 1000 * 60 * 60 * 24 * 30
                    );
                break;
            default:
                ctx.status = 400;
                return;
            }
        }
    } catch (err) {
        ctx.status = 400;
        console.log(err);
    }
};