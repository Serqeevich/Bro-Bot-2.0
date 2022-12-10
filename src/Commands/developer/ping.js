const { SlashCommandBuilder, CommandInteraction, Client, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { connection } = require('mongoose');

module.exports = {
    category: "developer",
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Bot ping')
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
                    .setColor('#2f3136')
                    .setDescription(
                        `**🟢 Online**\n\n`
                        + `**Ping**: ${client.ws.ping} ms\n`
                        + `**Время работы:** <t:${parseInt(client.readyTimestamp / 1000)}:R>\n`
                        + `**База данных:** ${switchTo(connection.readyState)}\n`
                        + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                    )
            ]
        })

    },
};

function switchTo(val) {
    var status = " ";
    switch (val) {
        case 0: status = `Disconnected`
            break;
        case 1: status = `Connected`
            break;
        case 2: status = `Connecting`
            break;
        case 3: status = `Disconnecting`
            break;
    }
    return status;
}
