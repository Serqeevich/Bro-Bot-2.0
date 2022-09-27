const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { Premium } = require('../../schemas/premium');
const { PREMIUM_ROLE_ID } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('premium-remove-id')
        .setDescription(`Удалить вышедшего участника из Premium базы данных.`)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option
            .setName('id')
            .setDescription('Укажите причину')
            .setRequired(true)
        )
    ,

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction) {

        const { options } = interaction;
        const id = options.getString('id');

        const db = await Premium.findOneAndDelete({ userId: id });

        if (db == null) {
            return interaction.reply({ content: `**Участник не найден**` })
        }

        interaction.reply({ content: `**Участник <@${id}> удален из базы данных**` })

    },
};