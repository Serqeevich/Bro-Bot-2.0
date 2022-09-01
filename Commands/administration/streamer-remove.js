const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { Streamers } = require('../../schemas/streamers');
const { ROLE_STREAMER } = require('../../config.json');

module.exports = {
    category: 'administration',
    data: new SlashCommandBuilder()
        .setName('streamer-remove')
        .setDescription('Удалить стримера.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option => option
            .setName('участник')
            .setDescription('Выберите участника которого нужно удалить.')
            .setRequired(true)
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {

        const { options } = interaction;
        const member = options.getMember('участник');

        const strteamer = await Streamers.findOneAndDelete({ userId: member.id });

        if (!strteamer) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`Blue`)
                        .setDescription(`**${member} не найден...**`)
                ],
                ephemeral: true
            });
        };

        member.roles.remove(ROLE_STREAMER);

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(`2f3136`)
                    .setDescription(`**У участника ${member} удалена роль <@&${ROLE_STREAMER}>**`)
            ],
            ephemeral: true
        })
    },
};