const { VoiceState } = require('discord.js');
const ms = require('ms');
//const { Members } = require('../../schemas/members');
const { Timers } = require('../../schemas/timers');
const { Times } = require('../../schemas/user-time')

module.exports = {
    name: 'voiceStateUpdate',
    /**
     * 
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState 
     */

    async execute(oldState, newState) {
        if (newState.member.user.bot) return;

        if (!oldState.channel && newState.channel?.id === newState.guild.afkChannelId) {
            return console.log(`return`)
        };

        try {
            const userId = newState.member.id;

            if (newState.channel && !(await Timers.findOne({ userId: userId }))) {
                // console.log(`${newState.member.user.username} подключился к голосовому каналу ${newState.channel.name}`)
                Timers({
                    userId: userId,
                    start: Date.now()
                }).save();
            };

            if (oldState.channel?.id &&
                !newState.channel?.id ||
                oldState.channel &&
                newState.channel?.id == newState.guild.afkChannelId) {

                //console.log(`${oldState.member.user.username} отключился от канала ${oldState.channel.name}`);

                Timers.findOne({ userId: userId }, async (err, timerData) => {
                    if (!timerData) return;

                    Times.findOne({ User: userId }, async (err, userData) => {
                        const time = Date.now() - timerData.start;
                        timerData.delete();
                        //console.log(ms(time, { long: true } + `для ${oldState.member.user.username}`))

                        if (!userData) {
                            Times({
                                User: userId,
                                Time: time,
                            }).save();
                        } else {
                            userData.Time += time;
                            userData.save();
                        }
                    })
                })
            };

        } catch (err) {
            console.log(err)
        }
    }
};