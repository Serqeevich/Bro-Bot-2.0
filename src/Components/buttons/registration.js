const { ButtonInteraction, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    id: 'reg_button',
    name: 'привязать аккаунт',
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */

    execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('reg_modal')
            .setTitle('Регистрация пользователя')
            .setComponents(
                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                        .setCustomId('reg_modal_text')
                        .setStyle(TextInputStyle.Short)
                        .setLabel('Введите ваш никнейм PUBG:BATTLEGROUNDS')
                        .setPlaceholder('Только для игроков пк версии.')
                        .setMinLength(0)
                        .setMaxLength(16)
                        .setRequired(true)
                )
            )
        interaction.showModal(modal);
    }
};