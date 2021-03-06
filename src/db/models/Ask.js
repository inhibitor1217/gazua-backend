const mongoose = require('mongoose');
const { Schema } = mongoose;

const AskSchema = new Schema({
    issuer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    currencyPair: String,
    price: Number,
    volume: Number,
    completedVolume: {
        type: Number,
        default: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    state: {
        type: String,
        default: 'pending'
    } // 'pending' | 'completed' | 'withdrawn' | 'warning'
});

const Ask = mongoose.model('Ask', AskSchema);

Ask.register = (ask) => {
    return new Ask(ask).save();
};

Ask.withdraw = (ask) => {
    if (ask && ask.state === 'pending') {
        ask.state = 'withdrawn';
        return ask.save();
    }
};

Ask.retrievePending = (currencyPair) => {
    return Ask.find({
        $and: [
            { $or: [{ state: 'pending' }, { state: 'warning' }] },
            { currencyPair }
        ]
    })
        .populate({ path: 'issuer', select: 'userdata.wallet' })
        .sort({ timestamp: +1 });
};

module.exports = Ask;