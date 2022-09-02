const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { Rooms } = require('../../schemas/private-room');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('private-rooms')
        .setDescription('Список приватных комнат.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, client) {

        const db = await Rooms.find({});

        let text = "";
        let i = 1;

        db.forEach(member => {
            const channel = interaction.guild.channels.cache.get(member.channelId)
            text += `**${i++}.** <@${member.userId}> - ${channel} <t:${parseInt(member.createdAt / 1000)}:R>\n`
        })

        text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#2f3136`)
                    .setThumbnail(client.user.avatarURL({ forceStatic: true }))
                    .setTitle(`Список приватных комнат`)
                    .setDescription(text)
                    .setFooter({
                        text: interaction.member.user.username,
                        iconURL: interaction.member.displayAvatarURL()
                    })
                    .setTimestamp()

            ], ephemeral: true
        })
    }
}
