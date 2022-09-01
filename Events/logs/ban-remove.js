const { WebhookClient, EmbedBuilder, Colors, AuditLogEvent } = require('discord.js');
const { BAN_KICK_MUTE_CHANNEL } = require('../../config.json');


module.exports = {
    name: 'guildBanRemove',

    async execute(ban) {

        

        const fetchedLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberBanRemove,
        });

        const banLog = fetchedLogs.entries.first();
        const { executor, target } = banLog;

        new WebhookClient({ url: BAN_KICK_MUTE_CHANNEL }).send({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#2f3136`)
                    .setAuthor({
                        name: `${target.username} разблокирован`,
                        iconURL: target.displayAvatarURL()
                    })
                    .setDescription(
                        `**Администратор**: <@${executor.id}>\n`
                        + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                    ).setTimestamp()
                    .setFooter({ text: '🟢' })
            ]
        })
    },
};