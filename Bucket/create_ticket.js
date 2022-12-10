const { ButtonInteraction, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    id: 'create_ticket',
    name: ' создать билет',
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */

    execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('create_ticket_modal')
            .setTitle('Жалоба на пользователя')
            .setComponents(
                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                        .setCustomId(`report_modal_id`)
                        .setStyle(TextInputStyle.Short)
                        .setLabel(`ID участника`)
                        .setMinLength(18)
                        .setMaxLength(18)
                        .setRequired(true)
                ),
                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                        .setCustomId(`report_modal_text`)
                        .setStyle(TextInputStyle.Paragraph)
                        .setLabel(`Коротко опишите что произошло`)
                        // .setMinLength(0)
                        // .setMaxLength()
                        .setRequired(true)
                )
            )
        interaction.showModal(modal);
    }
};