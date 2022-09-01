const { Message, EmbedBuilder, Colors, WebhookClient } = require('discord.js')
const { LOG_MESSAGE } = require('../../config.json');

module.exports = {
    name: 'messageDeleteBulk',
    /**
     * 
     * @param {Message} messages
     */

    execute(messages) {
        messages.map((m) => {
            //console.log(m.author, m.content)
        })
    },
};