const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const streamersSchema = new mongoose.Schema({
    userName: String,
    userId: {
        unique: true,
        type: String
    },
    channelName: {
        unique: true,
        type: String,
    },
    link: String,
    status: String,
},
    { timestamps: true }
);

const Streamers = mongoose.model('Streamer', streamersSchema);
module.exports.Streamers = Streamers;