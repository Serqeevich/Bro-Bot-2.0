const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const linkSchema = new mongoose.Schema({
    guildId: String,
    link: [String]
});

const WhiteList = mongoose.model('white list', linkSchema);
module.exports.WhiteList = WhiteList;