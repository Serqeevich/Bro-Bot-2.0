const mongoose = require('mongoose');
const { Schema, model } = require('mongoose')

const ticketSchema = new mongoose.Schema({
    userId: String,
    channelId: String,
});

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports.Ticket = Ticket; 