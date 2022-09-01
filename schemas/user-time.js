const mongoose = require('mongoose');
const { Schema, model } = require('mongoose')

const TimesSchema = new mongoose.Schema({
    User: String,
    Time: Number
});

const Times = mongoose.model('User-time', TimesSchema);
module.exports.Times = Times; 