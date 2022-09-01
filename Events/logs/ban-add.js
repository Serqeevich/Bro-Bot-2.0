const { WebhookClient, EmbedBuilder, Colors, AuditLogEvent } = require('discord.js');
const { Streamers } = require('../../schemas/streamers');

const { BAN_KICK_MUTE_CHANNEL } = require('../../config.json');

module.exports = {
    name: 'guildBanAdd',

    async execute(ban) {
        await Streamers.findOneAndDelete({ userId: member.id });

        const fetchedLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberBanAdd,
        });
        

        const banLog = fetchedLogs.entries.first();
        const { executor, target, reason } = banLog;

        new WebhookClient({ url: BAN_KICK_MUTE_CHANNEL }).send({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#2f3136`)
                    .setAuthor({
                        name: `${target.username} заблокирован`,
                        iconURL: target.displayAvatarURL()
                    })
                    .setDescription(
                        `**Причина**: ${reason ? reason : 'не указана'}\n`
                        + `**Администратор**: <@${executor.id}>\n`
                        + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                    ).setTimestamp()
                    .setFooter({text: '🔴'})

            ]
        })
    },
};
