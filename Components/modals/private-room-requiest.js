const { ModalSubmitInteraction, EmbedBuilder, ChannelType } = require('discord.js');
const { Rooms } = require('../../schemas/private-room');
const { Members } = require('../../schemas/members')
const { Times } = require('../../schemas/user-time')
const { REQUEST_CHANNEL_ID, COMMANDS_CHANNEL_ID, PRIVATE_ROOMS_PARENT_ID } = require('../../config.json');
const { ROLE_ADMINISTRATOR } = require('../../config.json');
const { toNormalTime } = require('../../utils/toNormalTime');
const moment = require('moment');
moment.locale('ru');

module.exports = {
    id: 'private_room_request_modal',
    /**
     * 
     * @param {ModalSubmitInteraction} interaction 
     */

    async execute(interaction, client) {

        const { member, fields, guild } = interaction;

        //получаем информацию из поля ввода
        const roomName = fields.getTextInputValue('private_room_request_text_input');

        //отвечаем участнику на запрос.
        interaction.reply({
            ephemeral: true,
            embeds: [
                new EmbedBuilder()
                    .setColor(`#2f3136`)
                    .setAuthor({ name: '🟢 Запрос отправлен', })
                    .setDescription(`**Вам прийдет оповещение когда его подтвердят или отклонят.**`)
            ]
        });

        //находим канал с запросами
        const channel = guild.channels.cache.get(REQUEST_CHANNEL_ID);

        //находим участсника в базе данных что бы получить его время в голосовых каналах
        const time = await Times.findOne({ User: member.id });

        //отправляем сообщение с запросом для администрации с упоминанием роли @Admin
        const message = await channel
            .send({
                content: `<@&${ROLE_ADMINISTRATOR}>`,
                allowedMentions: { roles: [ROLE_ADMINISTRATOR] },
                fetch: { cache: true, force: true },
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setDescription(
                            `**Запрос на создание приватной комнаты \` ${roomName} \`**\n\n`
                            + `**Участник**: <@${member.id}>\n`
                            + `**Присоединился  к серверу**: ${moment().to(member.joinedAt, true)}\n`
                            + `**Время в голосовых**: ${toNormalTime(time?.Time ? time?.Time : '0')}\n\n`
                            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                        ).setTimestamp()
                ]
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

                    //создаем голосовой канал
                    const newChannel = await guild.channels.create({
                        name: `🕋︰${roomName}`,
                        type: ChannelType.GuildVoice,
                        parent: PRIVATE_ROOMS_PARENT_ID
                    });

                    //добавляем участнику права на этот канал
                    await newChannel.permissionOverwrites.edit(member, { Connect: true });

                    //пробуем отправить участнику в личные сообщения о том что запрос одобрен
                    try {
                        await member.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(`#2f3136`)
                                    .setDescription(
                                        `**Запрос на создание приватной комнаты одобрен**\n`
                                        + `**Подключиться**: ${newChannel}\n`
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
                                        `**Запрос на создание комнаты ${newChannel} одобрен администратором ${executor}**\n`
                                        + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                                    )
                            ],
                            allowedMentions: { users: [member.id] },
                        })
                    };
                    //изменяем сообщение в канале запросов
                    await message.edit({
                        content: ' ',
                        embeds: [
                            new EmbedBuilder()
                                .setColor(`#2f3136`)
                                .setDescription(
                                    `**Запрос на создание приватной комнаты ${newChannel} одобрен**\n\n`
                                    + `**Участник**: <@${member.id}>\n`
                                    + `**Присоединился к серверу**: ${moment().to(member.joinedAt, true)}\n`
                                    + `**Время в голосовых**: ${toNormalTime(time?.Time ? time?.Time : '0')}\n\n`
                                    + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                                )
                                .setTimestamp()
                                .setFooter({ text: `🟢 Одобрил ${executor}`, })
                        ]
                    });

                    //записываем в базу участника и канал
                    Rooms.create({
                        owner: member.user.username,
                        userId: member.id,
                        channelName: newChannel.name,
                        channelId: newChannel.id,
                        users: Array,
                    });
                };


                if (reaction.emoji.name === '❌') {
                    //убираем реакции
                    message.reactions.removeAll()

                    //пробуем отправить участнику в лс сообщение с ответом
                    try {
                        await member.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(`#2f3136`)
                                    .setDescription(
                                        `**Запрос на создание комнаты \` ${roomName} \` отклонен**\n`
                                        + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                                        )
                                    .setFooter({ text: `🔴 Администратор ${executor}` })
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
                                        `**Запрос на создание комнаты \` ${roomName} \` отклонен администратором ${executor}**\n`
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
                                    `**Запрос на создание комнаты \` ${roomName} \` отклонен**\n\n`
                                    + `**Участник**: <@${member.id}>\n`
                                    + `**Присоединился к серверу**: ${moment().to(member.joinedAt, true)}\n`
                                    + `**Время в голосовых**: ${toNormalTime(time?.Time ? time?.Time : '0')}\n\n`
                                    + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                                )
                                .setTimestamp()
                                .setFooter({ text: `🔴 Отклонил ${executor}` })
                        ]
                    })
                };

                //ловим любые непредвиденные ошибки и отправляем их в тот же канал с запросом
            }).catch((err) => {
                channel.send({ content: `⛔ | **произошла ошибка...**\n\n${err}` })
            })
    }
};