const mongoose = require('mongoose');
const { Schema, model } = require('mongoose')

const bumpSchema = new mongoose.Schema({
    name: String,
    time: Number,
    lastMessageId: String,
    channelId: String,
});

const Bump = mongoose.model('Bump', bumpSchema);
module.exports.Bump = Bump; 