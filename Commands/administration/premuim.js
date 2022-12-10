const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits, Colors } = require("discord.js");
const { Premium } = require('../../schemas/premium');
const { PREMIUM_ROLE_ID } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('premium')
        .setDescription(`Список premium участников.`)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction, client) {

        const { member, guild, options } = interaction;

        const db = await Premium.find({})

        let description = "";
        let i = 1;

        db.forEach(member => {
            description += `**${i++}**. <@${member.userId}> - _выдан_ <t:${parseInt(member.date / 1000)}:R> на _${member.plan}_\n`
        })

        description += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Gold)
                    .setThumbnail(client.user.avatarURL({ forceStatic: true }))
                    .setTitle(`Список Premium участников`)
                    .setDescription(description)
                    .setFooter({
                        text: interaction.member.user.username,
                        iconURL: interaction.member.displayAvatarURL()
                    })
                    .setTimestamp()

            ], ephemeral: true
        })
    },
};