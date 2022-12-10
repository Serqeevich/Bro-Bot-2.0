const { RoleManager, WebhookClient, EmbedBuilder, Colors, AuditLogEvent } = require('discord.js');
const { LOG_ROLES } = require('../../config.json');

module.exports = {
    name: 'roleDelete',
    /**
     * 
     * @param {RoleManager} role 
     */

    async execute(role) {
        const { id, color, name } = role

        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleDelete
        });

        const rolesLog = fetchedLogs.entries.first();
        const { executor } = rolesLog;

        new WebhookClient({ url: LOG_ROLES }).send({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#2f3136`)
                    .setAuthor({
                        name: `Роль удалена`,
                        iconURL: executor.displayAvatarURL()
                    })
                    .setDescription(
                        `**Название**: ${name}\n`
                        + `**ID роли**: ${id}\n`
                        + `**Исполнитель**: ${executor}\n`
                        + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                    )
                    .setTimestamp()
                    .setFooter({ text: '🔴' })
            ]
        })
    }
}