const { Message, EmbedBuilder, WebhookClient } = require('discord.js')
const { LOG_MESSAGE } = require('../../config.json');

module.exports = {
    name: 'messageUpdate',
    /**
     * @param {Message} oldMessage
     * @param {Message} oldMessage 
     */

    execute(oldMessage, newMessage) {

        if (oldMessage.author.bot) return;
        if (oldMessage.content === newMessage.content) return;

        const count = 1950;
        const oldMess = oldMessage.content.slice(0, count) + (oldMessage.content.length > 1950 ? ' ...' : '')
        const newMess = newMessage.content.slice(0, count) + (newMessage.content.length > 1950 ? ' ...' : '')

        let description =
            `**Изменено сообщение в канале ${newMessage.channel}**\n\n`
            + `**Автор**: <@${oldMessage.member.id}>\n\n`
            + `До изменения:\n`
            + `\`\`\`${oldMess}\`\`\`\n`
            + `После изменения:\n`
            + `\`\`\`${newMess}\`\`\`\n`

        if (newMessage.attachments.size > 0) {
            description += `**Вложение**: [ссылка](${newMessage.attachments.map(a => a.url)})\n`
        };

        description += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

        new WebhookClient({ url: LOG_MESSAGE }).send({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#2f3136`)
                    .setDescription(description)
                    .setTimestamp()
                    .setFooter({ text: `🟡` })
            ]
        })
    },
};