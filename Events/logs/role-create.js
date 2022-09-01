const { RoleManager, WebhookClient, EmbedBuilder, Colors, AuditLogEvent } = require('discord.js');
const { LOG_ROLES } = require('../../config.json');

module.exports = {
    name: 'roleCreate',
    /**
     * 
     * @param {RoleManager} role 
     */

    async execute(role) {
        const { id } = role

        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleCreate
        });

        const rolesLog = fetchedLogs.entries.first();
        const { executor } = rolesLog;

        new WebhookClient({ url: LOG_ROLES }).send({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#2f3136`)
                    .setAuthor({
                        name: `Роль создана`,
                        iconURL: executor.displayAvatarURL()
                    })
                    .setDescription(
                        `**Название**: ${role}\n`
                        + `**ID роли**: ${id}\n`
                        + `**Создатель**: ${executor}\n`
                        + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                    )
                    .setTimestamp()
                    .setFooter({ text: '🟢' })
            ]
        })
    }
}