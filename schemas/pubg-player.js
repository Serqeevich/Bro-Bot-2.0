const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const UserSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true,
        unique: true,
    },
    pubgNickname: {
        type: String,
        required: true,
        unique: true
    },
    stats: {
        type: {},
        sparse: true
    },
});

UserSchema.set('timestamps', true);
UserSchema.methods = {};

const User = mongoose.model('Pubg player', UserSchema);
module.exports.User = User; 