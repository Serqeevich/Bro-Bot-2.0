const { SelectMenuInteraction, EmbedBuilder, WebhookClient } = require("discord.js");
const { LOG_COMMAND } = require('../../config.json');

module.exports = {
    name: 'interactionCreate',
    /**
     * 
     * @param {SelectMenuInteraction} interaction 
     */

    async execute(interaction, client) {

        if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);

            if (button.permissions && !interaction.member.permissions.has(button.permissions)) {
                return interaction.reply({
                    content: `**У вас не прав на использование этой кнопки.**`,
                    ephemeral: true
                });
            };

            button.execute(interaction, client);

            new WebhookClient({ url: LOG_COMMAND })
                .send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#2f3136`)
                            .setAuthor({
                                name: 'Использование кнопки',
                                iconURL: interaction.member.displayAvatarURL()
                            })
                            .setDescription(
                                `**Кнопка**: \` ${button.name} \`\n`
                                + `**Участник**: ${interaction.member}\n`
                                + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                            ).setTimestamp()
                            .setFooter({ text: '🟡' })
                    ]
                })
            return;


        } else if (interaction.isModalSubmit()) {
            const modal = client.modals.get(interaction.customId);
            modal.execute(interaction, client);

            new WebhookClient({ url: LOG_COMMAND })
                .send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#2f3136`)
                            .setAuthor({
                                name: 'Отправка формы',
                                iconURL: interaction.member.displayAvatarURL()
                            })
                            .setDescription(
                                `**Форма**: \` ${modal.id} \`\n`
                                + `**Участник**: ${interaction.member}\n`
                                + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                            ).setTimestamp()
                            .setFooter({ text: '🟣' })
                    ]
                })
            return;


        } else if (interaction.isSelectMenu()) {
            const selectMenu = client.selectMenus.get(interaction.customId);
            selectMenu.execute(interaction, client);
            return;


        } else {
            return;
        };
    },
};