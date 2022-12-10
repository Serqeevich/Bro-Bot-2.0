const { VoiceState } = require('discord.js');
const { Rooms } = require('../../schemas/private-room');
const { PRIVATE_ROOMS_PARENT_ID } = require('../../config.json');

module.exports = {
    name: 'voiceStateUpdate',
    /**
     * 
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
     */

    async execute(oldState, newState) {

        if (oldState?.channel?.parentId == PRIVATE_ROOMS_PARENT_ID && oldState?.channel?.members?.size == 0) {

            const db = await Rooms.findOne({ channelId: oldState.channelId });

            db.lastActivity = Date.now();
            db.save();

        } else { return };
    },
};