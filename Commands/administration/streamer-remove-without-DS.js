const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { Streamers } = require('../../schemas/streamers');
const { ROLE_STREAMER } = require('../../config.json');

module.exports = {
    category: 'administration',
    data: new SlashCommandBuilder()
        .setName('streamer-remove-without-ds')
        .setDescription('Удалить стримера.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option
            .setName('канал')
            .setDescription('Укажите название канала.')
            .setRequired(true)
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {

        const { options } = interaction;
        const channelName = options.getString('канал');

        const db = await Streamers.findOneAndDelete({ channelName: channelName });

        if (!db) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`Blue`)
                        .setDescription(`**Канал ${channelName} не найден...**`)
                ]
            });
        };

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(`2f3136`)
                    .setDescription(`**Канал ${channelName} удален**`)
            ]
        })
    },
};