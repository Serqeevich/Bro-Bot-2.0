const mongoose = require('mongoose');
const { Schema, model } = require('mongoose')

const memberSchema = new mongoose.Schema({
    username: String,
    userId: {
        unique: true,
        type: String,
    },
    thanks: Number,
});

const Members = mongoose.model('Member', memberSchema);
module.exports.Members = Members; 