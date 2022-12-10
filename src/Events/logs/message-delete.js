const { Message, EmbedBuilder, Colors, WebhookClient } = require('discord.js')
const { LOG_MESSAGE } = require('../../config.json');

module.exports = {
    name: 'messageDelete',
    /**
     * 
     * @param {Message} message 
     */

    execute(message) {

        if (message.author.bot) return;

        const { member, channel, content, attachments } = message;

        let description =
            `**Удалено сообщение в канале ${channel}**\n\n`
            + `**Автор**: <@${member.id}>\n\n`
            + `Содержимое:\n`
            + `\`\`\`${content ? content : 'отсутствует...'}\`\`\`\n`


        if (attachments.size >= 1) {
            description += `**Вложение**: [ссылка](${attachments.map(a => a.url)})\n`
        };

        description += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

        new WebhookClient({ url: LOG_MESSAGE }).send({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#2f3136`)
                    .setDescription(description)
                    .setTimestamp()
                    .setFooter({text: '🔴'})
            ]
        })
    },
};