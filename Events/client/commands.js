const { CommandInteraction, WebhookClient, EmbedBuilder } = require('discord.js');
const { LOG_COMMAND, ROLE_DEVELOPER } = require('../../config.json');


module.exports = {
    name: 'interactionCreate',
    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction, client) {
        if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);

            if (!command) return

            //try {
                await command.execute(interaction, client);

                new WebhookClient({ url: LOG_COMMAND })
                    .send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(`#2f3136`)
                                .setAuthor({
                                    name: 'Использование команды',
                                    iconURL: interaction.member.displayAvatarURL()
                                })
                                .setDescription(
                                    `**Команда**: \` ${commandName} \`\n`
                                    + `**Участник**: ${interaction.member}\n`
                                    + `**Канал**: ${interaction.channel}\n`
                                    + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                                ).setTimestamp()
                                .setFooter({ text: '🟢' })
                        ]
                    })

            // } catch (error) {

            //     await interaction.reply({
            //         embeds: [
            //             new EmbedBuilder()
            //                 .setColor(`#2f3136`)
            //                 .setDescription(
            //                     `**К сожаления произошла ошибка, повторите попытку.**\n`
            //                     + `**Если вы снова получите ошибку пожалуйста сообщите об этом упонянув роль <@&${ROLE_DEVELOPER}>**`
            //                 )
            //         ],
            //         ephemeral: true
            //     });
            // }

        }
    },
};