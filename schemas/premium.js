const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const premiumSchema = new mongoose.Schema({
    username: String,
    userId: {
        unique: true,
        type: String
    },
    plan: String,
    date: String,
    roleId: String,
    admin: String,

},
    {
        timestamps: true
    }
);

const Premium = mongoose.model('Premium member', premiumSchema);
module.exports.Premium = Premium;