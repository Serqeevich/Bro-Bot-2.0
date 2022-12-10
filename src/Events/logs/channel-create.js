const { WebhookClient, EmbedBuilder, AuditLogEvent, GuildChannel, ChannelType } = require('discord.js');
const { LOG_CHANNELS } = require('../../config.json');

module.exports = {
    name: 'channelCreate',
    /**
     * 
     * @param {GuildChannel} channel 
     */

    async execute(channel) {

        const { type, parent, parentId } = channel

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
            type: AuditLogEvent.ChannelCreate
        });

        const channelLog = fetchedLogs.entries.first();
        const { executor } = channelLog;

        new WebhookClient({ url: LOG_CHANNELS })
            .send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setAuthor({
                            name: 'Канал создан',
                            iconURL: executor.displayAvatarURL()
                        })
                        .setDescription(
                            `**Тип**: ${channelType}\n`
                            + `**Категория**: ${parent?.name ? parent?.name : 'main'}\n`
                            + `**Название**: ${channel.name}\n`
                            + `**Создатель**: ${executor}\n`
                            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                        )
                        .setTimestamp()
                        .setFooter({ text: '🟢' })
                ]
            })
    },
};