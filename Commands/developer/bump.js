const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    category: "developer",
    data: new SlashCommandBuilder()
        .setName('emit-bump')
        .setDescription('emit server bump...')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Blurple')
                    .setDescription(`[Top Discord Servers](https://myserver.gg/)\nServer bumped by <@${interaction.member.id}> 👍\n[+4 Bonus points]`)
            ],
        });

    },
};