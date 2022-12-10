const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const dailySchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
},
    {
        timestamps: true
    }
);

const DailyUpdates = mongoose.model('dailyupdates', dailySchema);
module.exports.DailyUpdates = DailyUpdates;