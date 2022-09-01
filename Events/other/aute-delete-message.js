const { Message, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { FIND_CHANNEL_ID } = require('../../config.json');

module.exports = {
    name: 'messageCreate',
    /**
     * 
     * @param {Message} message 
     * @returns 
     */

    async execute(message) {

        const { author, channel, member, guild } = message;

        if (author.bot) return;

        if (member.permissions.has(PermissionFlagsBits.Administrator) || member.permissions.has(PermissionFlagsBits.ModerateMembers)) return;

        const findChannel = guild.channels.cache.get(FIND_CHANNEL_ID);

        if (channel.id == findChannel.id) {
            await message.delete();

            try {
                member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#2f3136`)
                            .setDescription(`**В канале можно использовать только команды**: \` /find \`  \` /delete \`\n`)
                    ]
                })
            } catch (err) { }
        }
    }
}