const mongoose = require('mongoose');
const { Schema, model } = require('mongoose')

const timerSchema = new mongoose.Schema({
    userId: String,
    start: Number,
});

const Timers = mongoose.model('Timer', timerSchema);
module.exports.Timers = Timers; 