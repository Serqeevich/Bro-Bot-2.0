const mongoose = require('mongoose');
const { Schema, model } = require('mongoose')

const settingsSchema = new mongoose.Schema({
    name: String,
    value: String,
});

const Settings = mongoose.model('Setting', settingsSchema);
module.exports.Settings = Settings; 