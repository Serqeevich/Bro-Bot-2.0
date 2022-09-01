const { VoiceState, WebhookClient, EmbedBuilder } = require('discord.js');
const { LOG_VOICE } = require('../../config.json');

module.exports = {
    name: 'voiceStateUpdate',
    /**
     * 
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState 
     */
    execute(oldState, newState) {

        if (oldState.channel?.id === newState.channel?.id) {
            return;
        };

        if (newState.channel?.id && oldState.channel?.id == null) {

            new WebhookClient({ url: LOG_VOICE }).send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setAuthor({
                            name: 'Голосовое подключение',
                            iconURL: newState.member.displayAvatarURL()
                        })
                        .setDescription(
                            `**Участник**: <@${newState.member.id}>\n`//${newState.channel}
                            + `**Канал**: ${newState.channel}\n`
                            + `**Название**: ${newState.channel.name}\n`
                            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                        )
                        .setTimestamp()
                        .setFooter({ text: `🟢` })
                ]
            })
        };

        if (oldState.channel?.id && newState.channel?.id == null) {

            new WebhookClient({ url: LOG_VOICE }).send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setAuthor({
                            name: 'Голосовое отключение',
                            iconURL: newState.member.displayAvatarURL()
                        })
                        .setDescription(
                            `**Участник**: <@${oldState.member.id}>\n`//${newState.channel}
                            + `**Название**: ${oldState.channel.name}\n`
                            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                        )
                        .setTimestamp()
                        .setFooter({ text: `🔴` })
                ]
            })
        };

        if (oldState.channel?.id && newState.channel?.id) {

            new WebhookClient({ url: LOG_VOICE }).send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setAuthor({
                            name: 'Голосовое перемещение',
                            iconURL: newState.member.displayAvatarURL()
                        })
                        .setDescription(
                            `**Участник**: ${newState.member}\n`
                            + `**Из канала**: ${oldState.channel}\n`
                            + `**В канал**: ${newState.channel}\n`
                            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                        )
                        .setTimestamp()
                        .setFooter({ text: '🟡' })
                ]
            })
        };

    },
};
