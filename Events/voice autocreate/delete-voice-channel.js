const { VoiceState } = require('discord.js');
const { TPP_CATEGORY_ID, FPP_CATEGORY_ID, DUO_CATEGORY_ID, RANK_CATEGORY_ID, GAMES_CATEGORY_ID, GAMES_CHANNEL_ID } = require('../../config.json');

module.exports = {
    name: 'voiceStateUpdate',


    execute(oldState) {

        const categories = [TPP_CATEGORY_ID, FPP_CATEGORY_ID, DUO_CATEGORY_ID, RANK_CATEGORY_ID, GAMES_CATEGORY_ID,]

        for (const categori of categories) {
            if (oldState?.channel?.parent?.id == categori && !oldState.channel?.members?.size && oldState?.channel?.id != GAMES_CHANNEL_ID) {
                oldState.channel.delete();
            };
        };
    },
};