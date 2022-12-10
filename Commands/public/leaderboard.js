const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { Times } = require('../../schemas/user-time');
const { toNormalTime } = require('../../utils/toNormalTime')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Список самых активных участников'),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction, client) {

        const { guild } = interaction;
        let users = await Times.find({}).sort({ Time: -1 })

        users = users.slice(0, 20)

        let i = 1
        let text = ''

        users.forEach(async u => {
            const member = guild.members.cache.get(u.User)
            if (member && !member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
                text += `**${i++}.** **${member.user.username}**  - ${toNormalTime(u.Time)}\n` //<@${u.User}>
            };
        })
        text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
        text += `❕ _За каждые 500 часов дарим Premium на 1 месяц_\n`
        text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#2f3136`)
                    .setThumbnail(client.user.avatarURL({ forceStatic: true }))
                    .setTitle(`Самые активные участники`)
                    .setDescription(text)
                    .setFooter({ text: `/user-info - узнать свое время` })
                    .setTimestamp()
            ]
        })

    },
};