const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const privateRoomSchema = new mongoose.Schema({
    owner: String,
    userId: {
        unigue: true,
        type: String,
    },
    channelName: String,
    channelId: String,
    users: Array,
    lastActivity: String,
}, {
    timestamps: true
});

const Rooms = mongoose.model('Private room', privateRoomSchema);
module.exports.Rooms = Rooms;