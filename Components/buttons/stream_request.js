const { EmbedBuilder, Colors, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { Streamers } = require('../../schemas/streamers');
const { ROLE_STREAMER } = require('../../config.json');

module.exports = {
    id: 'stream_request',
    name: 'отправить запрос(streamer)',

    async execute(interaction) {

        const check = await Streamers.findOne({ userId: interaction.member.id });
        if (check) {
            return interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`**У вас уже есть роль <@&${ROLE_STREAMER}>**`)
                ]
            })
        };

        const modal = new ModalBuilder()
            .setCustomId('stream_request_modal')
            .setTitle('Запрос')
            .setComponents(
                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                        .setCustomId('stream_request_textInput_channelName')
                        .setLabel('Название канала')
                        .setPlaceholder('название вашего twitch-канала')
                        .setMinLength(0)
                        .setMaxLength(50)
                        .setStyle(TextInputStyle.Short)

                ),

                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                        .setCustomId('stream_request_textInput_link')
                        .setLabel('ссылка на ваш канал')
                        .setPlaceholder('https://www.twitch.tv/')
                        .setMinLength(0)
                        .setMaxLength(100)
                        .setStyle(TextInputStyle.Short)

                )
            )

        interaction.showModal(modal)
    },
};

