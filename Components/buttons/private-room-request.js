const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const { Rooms } = require('../../schemas/private-room')

module.exports = {
    id: 'private_room_request_button',
    name: 'Отправить запрос(room)',

    async execute(interaction) {

        const check = await Rooms.findOne({ userId: interaction.member.id });
        if (check) {
            return interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`**У вас уже есть своя комната <#${check.channelId}>**`)
                ]
            })
        };

        const modal = new ModalBuilder()
            .setCustomId('private_room_request_modal')
            .setTitle('Запрос')
            .setComponents(
                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                        .setCustomId('private_room_request_text_input')
                        .setLabel('введите имя')
                        .setPlaceholder('придумайте имя для вашего канала')
                        .setMinLength(3)
                        .setMaxLength(10)
                        .setStyle(TextInputStyle.Short)
                )
            )

        interaction.showModal(modal)
    },
};