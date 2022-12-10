const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const verifySchema = new mongoose.Schema({
    userId: {
        unique: true,
        type: String,
    },
    pinCode: String,
});

const Verify = mongoose.model('Verify', verifySchema);
module.exports.Verify = Verify;