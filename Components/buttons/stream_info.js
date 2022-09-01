const { EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { ROLE_STREAMER, ROLE_LIVE_STREAM, ROLE_STREAM_NOTIFY, STREAMS_CHANNEL_ID } = require('../../config.json');


module.exports = {
    id: 'testId',
    name: 'Я стример',

    async execute(interaction) {

        const role = interaction.guild.roles.cache.get(ROLE_STREAMER)
        const channel = interaction.guild.channels.cache.get(STREAMS_CHANNEL_ID)

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.DarkButNotBlack)
                    .setTitle(`На данный момент мы сотрудничаем только с Twitch стримерами!\n\n`)
                    .setURL(`https://www.twitch.tv/`)
                    .setDescription(
                        `**Условия сотрудничества:**\n`
                        + `🔹 проводить стримы не менее 2-х раз в неделю\n`
                        + `🔹 иметь неменее 500 подписчиков на канале\n`
                        + `🔹 разместить ссылку на наше дискорд-сообщество в описании своего канала\n\n`
                        + `**Ссылка для размещения - https://discord.gg/Ez8hdFJhER**\n\n`
                        + `**Что вы получите:**\n`
                        + `🔸 роль <@&${ROLE_STREAMER}>\n`
                        + `🔸 роль <@&${ROLE_LIVE_STREAM}> которая выделит вас в списке участников когда вы проводите стрим\n`
                        + `🔸 автоматические уведомления о начале стрима в канале ${channel} с упоминанием роли <@&${ROLE_STREAM_NOTIFY}>\n\n`
                        + `❗ **Отправляя запрос убедитесь что вы правильно указали имя вашего канала, соблюдая маленькие и большие буквы!**`
                    )
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('stream_request')
                        .setLabel('Отправить запрос')
                        .setStyle(ButtonStyle.Success)
                )
            ],
            ephemeral: true,
        });
    }
};

