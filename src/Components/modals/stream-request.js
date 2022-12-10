const { ModalSubmitInteraction, EmbedBuilder, Colors } = require("discord.js");
const { Streamers } = require('../../schemas/streamers')
const { REQUEST_CHANNEL_ID, COMMANDS_CHANNEL_ID } = require('../../config.json');
const { ROLE_STREAMER, ROLE_ADMINISTRATOR } = require('../../config.json');


module.exports = {
    id: 'stream_request_modal',
    /**
     * 
     * @param {ModalSubmitInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {

        const { member, fields } = interaction;

        //получаем нужные  поля ввода из модал образца
        const url = fields.getTextInputValue('stream_request_textInput_link');
        const streamChannelName = fields.getTextInputValue('stream_request_textInput_channelName');

        //отвечаем участнику на запрос
        interaction.reply({
            ephemeral: true,
            embeds: [
                new EmbedBuilder()
                    .setColor(`#2f3136`)
                    .setAuthor({ name: `🟢 Запрос отправлен`, })
                    .setDescription(`**Вам прийдет оповещение когда запрос подтвердят или отклонят.**`)
            ]
        });

        //находим канал с запросами
        const channel = interaction.guild.channels.cache.get(REQUEST_CHANNEL_ID);

        //отправляем сообщение с запросом для администрации с упоминанием роли @Admin
        const message = await channel
            .send({
                content: `<@&${ROLE_ADMINISTRATOR}>`,
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setDescription(
                            `**Запрос на получение роли <@&${ROLE_STREAMER}>**\n\n`
                            + `**Стример**: <@${member.id}>\n`
                            + `**Название канала**: ${streamChannelName}\n`
                            + `**Ссылка на канал**: ${url}\n\n`
                            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                        ).setTimestamp()

                ],
                allowedMentions: { roles: [ROLE_ADMINISTRATOR] },
                fetch: { cache: true, force: true }
            });


        //добавляем реакции на сообщение
        message.react('✅').then(() => message.react('❌'));

        //фильтруем реакции, что бы голос бота не учитывался
        const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id !== client.user.id

        //запускаем фильтр: 24 часа или нажатие на 1 из реакций
        message.awaitReactions({ filter, max: 1, time: 1000 * 60 * 60 * 24 })
            .then(async collected => {
                const reaction = collected.first();

                let executor; //администратор который отреагировал на сообщение
                const users = reaction.users.cache.filter(user => user.id !== client.user.id);
                users.map(user => executor = user.username);

                //Подтверждение запроса
                if (reaction.emoji.name === '✅') {
                    message.reactions.removeAll()

                    //проверка на наличие такого стрим-канала в базе данных
                    const check = await Streamers.findOne({ channelName: streamChannelName });
                    if (check) {
                        message.edit({
                            content: ' ',
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('#2f3136')
                                    .setDescription(
                                        `**Запрос на получение роли <@&${ROLE_STREAMER}> прерван**\n\n`
                                        + `**Стример**: <@${member.id}>\n`
                                        + `**Название канала**: ${streamChannelName}\n`
                                        + `**Ссылка на канал**: [ссылка](${url})\n\n`
                                        + `🛑 | **Twitch канал с таким именем уже зарегистрирован.**\n`
                                        + `Свяжитесь с участником для дальнейших действий...\n\n`
                                        + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                                    )
                                    .setTimestamp()
                                    .setFooter({ text: `Администратор ${executor}` })
                            ]
                        });
                        return
                    };

                    //после проверки записываем новый стрим канал в базу данных
                    await Streamers({
                        userName: member.user.username,
                        userId: member.id,
                        channelName: streamChannelName,
                        link: url,
                        status: null,
                    }).save();

                    //выдаем участнику роль Streamer
                    member.roles.add(ROLE_STREAMER);

                    //пробуем отправить участнику в личные сообщения о том что запрос одобрен
                    try {
                        await member.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(`#2f3136`)
                                    .setDescription(
                                        `**Запрос на получение роли \` Streamer \` одобрен.**\n`
                                        + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                                    )
                                    .setFooter({ text: `🟢 Администратор ${executor}`, })
                            ]
                        });


                        //если у участника закрыт ЛС отправляем сообщение с ответом в общий канал на сервере с упоминанием участника
                    } catch (err) {
                        const channel = client.channels.cache.get(COMMANDS_CHANNEL_ID);

                        channel.send({
                            content: `<@${member.id}>`,
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(`#2f3136`)
                                    .setDescription(
                                        `**Запрос на получение роли <@&${ROLE_STREAMER}> одобрен администратором ${executor}**\n`
                                        + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                                        )
                            ],
                            allowedMentions: { users: [member.id] },
                        })
                    };

                    //далее редактируем сообщени с запросом на положительное
                    await message.edit({
                        content: ' ',
                        embeds: [
                            new EmbedBuilder()
                                .setColor(`#2f3136`)
                                .setDescription(
                                    `**Запрос на получение роли <@&${ROLE_STREAMER}> одобрен**\n\n`
                                    + `**Стример**: <@${member.id}>\n`
                                    + `**Название канала**: ${streamChannelName}\n`
                                    + `**Ссылка на канал**: ${url}\n\n`
                                    + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                                )
                                .setTimestamp()
                                .setFooter({ text: `🟢 Одобрил ${executor}` })
                        ]
                    })
                };

                //отклонение запроса
                if (reaction.emoji.name === '❌') {
                    //уьираем реакции
                    message.reactions.removeAll()

                    //пробуем отправить участнику в лс сообщение с ответом
                    try {
                        await member.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(`#2f3136`)
                                    .setDescription(
                                        `**Запрос на получение роли \` Streamer \` отклонен**\n`
                                        + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                                        )
                                    .setFooter({ text: `🔴 Администратор ${executor}`, })
                            ]
                        });

                        //если ЛС закрыт отправляем ответ в канал на сервере
                    } catch (err) {
                        const channel = client.channels.cache.get(COMMANDS_CHANNEL_ID);
                        channel.send({
                            content: `<@${member.id}>`,
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(`#2f3136`)
                                    .setDescription(
                                        `**Запрос на получение роли <@&${ROLE_STREAMER}> отклонен администратором ${executor}**\n`
                                        + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                                        )
                            ],
                            allowedMentions: { users: [member.id] },

                        })
                    };

                    //редактируем сообщение с запросом
                    await message.edit({
                        content: ' ',
                        embeds: [
                            new EmbedBuilder()
                                .setColor(`#2f3136`)
                                .setDescription(
                                    `**Запрос на получение роли <@&${ROLE_STREAMER}> отклонен**\n\n`
                                    + `**Стример**: <@${member.id}>\n`
                                    + `**Название канала**: ${streamChannelName}\n`
                                    + `**Ссылка на канал**: ${url}\n\n`
                                    + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                                )
                                .setTimestamp()
                                .setFooter({ text: `🔴 Отклонил ${executor}`, })
                        ]
                    })
                };

                //ловим любые непредвиденные ошибки и отправляем их в тот же канал с запросом
            }).catch((err) => {
                channel.send({ content: `⛔ | **произошла ошибка...**\n\n${err}` })
            })
    },
};