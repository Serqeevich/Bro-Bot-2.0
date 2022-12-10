const { ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    id: 'support_report',
    name: 'связаться с администрацией',
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */

    async execute(interaction) {

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Aqua)
                    .setAuthor({
                        name: 'Прежде чем отправить жалобу на участника убедитесь что у вас есть доказательства нарушения правил сообщества!',
                        iconURL: 'https://cdn.discordapp.com/attachments/972441100251963442/1010884748513640499/52639_security_warning_icon.png'
                    })
                    .setDescription(
                        'Так же вам необходимо скопировать его ID - для этого вам нужно включить **режим разработчика** в настройках своего акккаунта.\n'
                        + '\`\`\`настройки/расширенные/режим разработчика\`\`\`\n'
                        + 'После того как вы получили ID участника можете создать билет нажав на кнопку ниже.'
                    )
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('create_ticket')
                        .setStyle(ButtonStyle.Primary)
                        .setLabel('Создать билет')
                )
            ], ephemeral: true
        })
    },
};