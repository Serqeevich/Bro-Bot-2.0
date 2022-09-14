const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bans')
        .setDescription('Кол-во банов на сервере.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,
    /**
     * @param {CommandInteraction} interaction
     */

    async execute(interaction) {

        const { guild } = interaction;

        const ban = await guild.bans.fetch();

        interaction.reply({ content: `**Заблокировано ${ban.size} пользователей**` })
    },
}