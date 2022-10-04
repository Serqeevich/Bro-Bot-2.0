const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { Streamers } = require('../../schemas/streamers')

module.exports = {
    category: 'administration',
    data: new SlashCommandBuilder()
        .setName('streamers')
        .setDescription('Список стримеров.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction, client) {

        const streamers = await Streamers.find({});

        let description = "";
        let i = 1;
        let status = "";


        streamers.forEach(streamer => {

            switch (streamer.status) {
                case 'online': status = '🟢'
                    break;
                default : status = '🔴'
            };

            description += `${status} **${i++}.** <@${streamer.userId ? streamer.userId : 'Без дискорда'}> - [${streamer.channelName}](${streamer.link}) <t:${parseInt(streamer.updatedAt / 1000)}:R>\n`

        });
        description += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#9146FF`)
                    .setThumbnail(client.user.avatarURL({ forceStatic: true }))
                    .setTitle(`Список стримеров`)
                    .setDescription(description)
                    .setFooter({
                        text: interaction.member.user.username,
                        iconURL: interaction.member.displayAvatarURL()
                    })
                    .setTimestamp()
            ]
        });

    },
};