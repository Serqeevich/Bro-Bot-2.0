const { ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    id: 'support_admin',
    name: 'связаться с администрацией',
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */

    async execute(interaction) {

        interaction.reply({
            content: '**Выберите категорию**',
            components: [
                new ActionRowBuilder().addComponents(

                    new ButtonBuilder()
                        .setCustomId(`category_2`)
                        .setLabel('Рекламма')
                        .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                        .setCustomId(`category_1`)
                        .setLabel('Сотрудничество')
                        .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                        .setCustomId(`category_3`)
                        .setLabel('другое')
                        .setStyle(ButtonStyle.Primary),

                )], ephemeral: true

        });
    },
};