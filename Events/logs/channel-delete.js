const { WebhookClient, EmbedBuilder, Colors, AuditLogEvent, GuildChannel, ChannelType } = require('discord.js');
const { LOG_CHANNELS } = require('../../config.json');
const { Rooms } = require('../../schemas/private-room');

module.exports = {
    name: 'channelDelete',
    /**
     * 
     * @param {GuildChannel} channel 
     */

    async execute(channel) {
        const { type, parent, guild } = channel

        try {
            const check = await Rooms.findOne({ channelId: channel.id });
            check.delete();

        } catch { }

        let channelType;
        switch (type) {
            case 0: channelType = 'текстовый'
                break;
            case 2: channelType = 'голосовой'
                break;
            case 5: channelType = 'новостной'
                break
            case 13: channelType = 'трибуна'
        }

        const fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.ChannelDelete
        });

        const channelLog = fetchedLogs.entries.first();
        const { executor } = channelLog;

        new WebhookClient({ url: LOG_CHANNELS })
            .send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setAuthor({
                            name: 'Канал удален',
                            iconURL: executor.displayAvatarURL()
                        })
                        .setDescription(
                            `**Тип**: ${channelType}\n`
                            + `**Категория**: ${parent?.name ? parent?.name : 'main'}\n`
                            + `**Название**: ${channel.name}\n`
                            + `**Исполнитель**: ${executor}\n`
                            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                        )
                        .setTimestamp()
                        .setFooter({ text: '🔴' })
                ]
            })
    },
};
