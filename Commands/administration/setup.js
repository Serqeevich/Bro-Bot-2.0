const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder, SelectMenuOptionBuilder, Colors, Attachment } = require('discord.js');
const { ROLE_STREAMER, ROLE_NEWS_NOTIFY, ROLE_STREAM_NOTIFY, ROLE_FIND_NOTIFY, PRIVATE_ROOMS_PARENT_ID } = require('../../config.json');

module.exports = {
    category: 'administration',
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Выберите нужную опцию.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option
                .setName('опция')
                .setDescription('Выберите опцию для канала.')
                .setRequired(true)
                .addChoices(
                    { name: 'верификация', value: 'verification' },
                    { name: 'правила', value: 'rules' },
                    { name: 'роли', value: 'roles' },
                    { name: 'поиск', value: 'find' },
                    { name: 'инфо', value: 'info' },
                    { name: 'информация', value: 'information' },
                )
        ),

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction) {

        const { options, guild } = interaction;
        const choices = options.getString('опция')
        await interaction.deferReply({ ephemeral: true });

        switch (choices) {
            case 'roles': {

                const master = interaction.guild.roles.cache.find(r => r.name == 'Master') || null;
                const diamond = interaction.guild.roles.cache.find(r => r.name == 'Diamond') || null;
                const platinum = interaction.guild.roles.cache.find(r => r.name == 'Platinum') || null;
                const gold = interaction.guild.roles.cache.find(r => r.name == 'Gold') || null;
                const silver = interaction.guild.roles.cache.find(r => r.name == 'Silver') || null;
                const bronze = interaction.guild.roles.cache.find(r => r.name == 'Bronze') || null;

                await interaction.channel.send({
                    content:
                        `**Чтобы получить роли:**\n\n`
                        + `${master} ${diamond} ${platinum} ${gold} ${silver} ${bronze}\n`
                        + `**а так же роли \` ADR+ \` и \` KD+ \` вам нужно связать свой игровой аккаунт с аккаунтом Discord нажав на кнопку**\n`
                    //+ `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`,
                    , components: [
                        new ActionRowBuilder().addComponents(

                            new ButtonBuilder()
                                .setCustomId('reg_button')
                                .setLabel('Привязать аккаунт⁣')
                                .setStyle(ButtonStyle.Success),

                            // new ButtonBuilder()
                            //     .setCustomId('update_button')
                            //     .setLabel('Обновить статистику')
                            //     .setStyle(ButtonStyle.Primary),
                        )
                    ]
                });

                await interaction.channel.send({
                    content:
                        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
                        + `**Если вы <@&${ROLE_STREAMER}> вы можете получить дополнительную информацию нажав на кнопку**\n\n`
                    //+ `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`,
                    , components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId('testId')
                                .setLabel('⁣⁣ Я стример ⁣⁣ ⁣')
                                .setStyle(ButtonStyle.Primary),
                        )
                    ]
                });

                await interaction.channel.send({
                    content:
                        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
                        + `**Если вы хотите получать уведомления выберите одну или несколько ролей из списка:**\n\n`
                    //+ `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`,
                    , components: [
                        new ActionRowBuilder().addComponents(
                            new SelectMenuBuilder()
                                .setCustomId('notify_roles')
                                .setPlaceholder('Роли уведомлений...')
                                .setMinValues(0)
                                .setMaxValues(3)
                                .setOptions(
                                    new SelectMenuOptionBuilder
                                        ({ label: '📣 Новости', value: ROLE_NEWS_NOTIFY }),
                                    new SelectMenuOptionBuilder
                                        ({ label: '🎬 Стримы', value: ROLE_STREAM_NOTIFY }),
                                    new SelectMenuOptionBuilder
                                        ({ label: '🔎 Поиск игроков', value: ROLE_FIND_NOTIFY }),
                                ),
                        ),
                    ]
                })

                interaction.editReply({ content: `**Готово.**` })
            }; break;

            case 'verification': {

                interaction.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#00FF00')
                            .setTitle(`Добро пожаловать в сообщество ${interaction.guild.name}`)
                            .setDescription(
                                `Спасибо что ты к нам присоединился, мы очень этому рады!\n\n`
                                + `Пожалуйста, удели немного своего времени чтобы пройти верификацию.\n`
                                + `Это нужно для того что бы защитить сообщество и все участники чувствовали себя комфортно.\n\n`
                                + `Нажав на кнопку пройти верификацию тебе откроется окно с случайно-сгенерированым пин-кодом, который нужно ввести в соответствующее поле, вот и все.\n\n`
                                + `**Важно:**\n`
                                + `Никогда не вводите свои личные данные в подобных запросах. Так делают только мошенники!\n\n`
                                + `_Нажав на кнопку отправить вы автоматически соглашаетесь с правилами сообщества._`
                            )
                    ],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId('verify')
                                .setLabel('✅ Пройти верификацию')
                                .setStyle(ButtonStyle.Success),

                            new ButtonBuilder()
                                .setCustomId('rules')
                                .setLabel('📗 Правила')
                                .setStyle(ButtonStyle.Primary)
                        ),
                    ]
                });

                interaction.editReply({ content: 'Готово!' })
            }; break;

            case 'rules': {

                const channel = interaction.guild.rulesChannel;

                if (!channel) return interaction.editReply({ content: `В сообществе нет канала правил.` })

                await channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#2f3136`)
                            .setTitle(`Будьте дружелюбны, вежливы и с уважением относитесь к другим участникам сообщества!`)
                            .setDescription(
                                `**1.** Запрещено оскорбление, преследование, угроза или дискриминация любого рода.\n\n`
                                + `**2.** Запрещены материалы расистского, сексистского, сексуального или оскорбительного характера.\n\n`
                                + `**3.** Запрещен контент связанный с мошенническими программами или сайтами.\n\n`
                                + `**4.** Запрещено разглашать личную информацию об участниках сообщества.\n\n`
                                + `**5.** Запрещен NSFW контент.\n\n`
                                + `**6.** Запрещен спам.\n\n`
                                + `**7.** Запрещено что либо рекламировать.\n\n`
                                + `**8.** Запрещены ссылки на другие дискорд сервера.\n\n`
                                + `**Нарушение или обход правил приведет к блокировке в нашем сообществе.**\n\n`
                                + `**Эти правила не являются исчерпывающими, на сообщество так же распространяются общие правила [Discord](https://discord.com/guidelines)**\n\n`
                            )
                            .setFooter({ text: `Администрация  вправе использовать свое суждение, когда будет иметь дело с деструктивным или иным неподобающим поведением.`, })
                    ],
                    components: [
                        new ActionRowBuilder()
                            .setComponents(
                                new ButtonBuilder()
                                    .setURL('https://myserver.gg/ru/907628983577890886')
                                    .setLabel('Поставить лайк')
                                    .setEmoji('💚')
                                    .setStyle(ButtonStyle.Link),

                                new ButtonBuilder()
                                    .setURL('https://myserver.gg/ru/907628983577890886')
                                    .setLabel('Оставить отзыв')
                                    .setEmoji('💌')
                                    .setStyle(ButtonStyle.Link)
                            )
                    ]
                })

                interaction.editReply({ content: `**Готово**` })
            } break;

            case 'find': {

                const { TPP_CHANNEL_ID, FPP_CHANNEL_ID, DUO_CHANNEL_ID, RANK_CHANNEL_ID, GAMES_CHANNEL_ID } = require('../../config.json')

                await interaction.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#2f3136`)
                            .setDescription(
                                `**Чтобы создать приглашение создайте свою комнату**:\n\n`
                                + `<#${TPP_CHANNEL_ID}>\n`
                                + `<#${FPP_CHANNEL_ID}>\n`
                                + `<#${DUO_CHANNEL_ID}>\n`
                                + `<#${RANK_CHANNEL_ID}>\n`
                                + `<#${GAMES_CHANNEL_ID}>\n`
                                + `**после чего используйте слеш-команду \`find\`**\n\n`
                                + `_Чтобы изменить свое сообщение - повторно отправьте команду_ \`find\`\n`
                                + `_Чтобы удалить сообщение используйте команду_ \`delete\`\n`
                                + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                            )

                        //.setImage('https://cdn.discordapp.com/attachments/1005443985592041472/1005444096950812692/pubg-season-10-header-final.jpg')
                    ],

                });

                interaction.editReply({ content: `**Готово!**` })
            }; break;

            //Сообщение для приватной категории
            case 'info': {
                const { PREMIUM_ROLE_ID } = require('../../config.json')
                await interaction.channel.send({
                    content:
                        `**Если у вас есть своя команда или вы хотите для себя приватную комнату - вы можете отправить запрос на ее создание.**\n`
                        + `**В течении некоторого времени вам прийдет положительный или отрицательный ответ.**\n\n`
                        // + `Каким будет ответ зависит от того какой у вас уровень на сервере и были ли на вас жалобы от других участников.\n`
                        // + `<@&${PREMIUM_ROLE_ID}> участники 100% получат положительный ответ.\n`
                        + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`

                    , components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId('private_room_request_button')
                                .setLabel('Отправить запрос')
                                .setStyle(ButtonStyle.Primary)
                        )
                    ]
                })

                interaction.editReply({ content: `**Готово!**` })

            }; break;

            case 'information': {
                const { FIND_CHANNEL_ID, ROLES_CHANNEL_ID, VIDEO_CHANNEL_ID, HELP_CHANNEL_ID, STREAMS_CHANNEL_ID, COMMANDS_CHANNEL_ID, CHAT_CHANNEL_ID, MUSIC_CHANNEL_ID } = require('../../config.json');
                const { Level_1, Level_2, Level_3, Level_4, Level_5, ROLE_ADMINISTRATOR } = require('../../config.json');
                const { PREMIUM_ROLE_ID } = require('../../config.json')
                const message1 = await interaction.channel.send({
                    content:
                        `**Приветствую!**\n\n`
                        + `**Мы очень рады что ты присоединился к нам и мы очень стараемся чтобы каждый участник чувствовал себя комфортно.**\n\n`
                        + `**Расскажу тебе немного о нас...**\n`
                        + `_Ты можешь найти себе команду создав приглашение для своего голосового канала вот здесь - <#${FIND_CHANNEL_ID}>, `
                        + `а чтобы получить интересующие тебя роли загляни в канал <#${ROLES_CHANNEL_ID}>_\n`
                        + `_Мы очень уважаем творческих людей и поэтому для стримеров у нас есть специальный канал <#${STREAMS_CHANNEL_ID}> где публикуются ссылки на их стримы, загляни туда обязательно._\n`
                        + `_Использовать нашего бота ты можешь в канале <#${COMMANDS_CHANNEL_ID}>, а просто пообщаться на разные темы заходи в  <#${CHAT_CHANNEL_ID}>, с радостью тебя там встретим!)_\n`
                        + `_А если у тебя есть вопросы то смело задавай их в канале <#${HELP_CHANNEL_ID}>_\n\n`
                        + `**Кстати если ты хочешь расслабиться и заняться своими делами, то в канале <#${MUSIC_CHANNEL_ID}> тебя никто не потревожит, а <@${`830530156048285716`}> скрасит твое время легкой и расслабляющей музыкой в стиле Lofi hip hop.**\n\n`
                        + `**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\n\n`
                }); message1.react(`💚`)


                const message2 = await interaction.channel.send({
                    content:
                        `**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\n\n`
                        + `**Ты можешь нам помочь и мы будем тебе очень признательны!**\n`
                        + `Причем не важно какого рода будет помощь - будь то финансовая поддержка, буст сервера или активное участие в жизни нашего сообщества.\n\n`
                        + `**Мы очень ценим участников которые проявляют активность и поощряем их привилегиями предоставляя возможность:**\n`
                        + `<@&${Level_1}> - использовать GIF\n`
                        + `<@&${Level_2}> - проводить стримы\n`
                        + `<@&${Level_3}> - прикреплять файлы\n`
                        + `<@&${Level_4}> - изменять никнейм\n`
                        + `<@&${Level_5}> - публиковать ссылки\n`
                        + `_Эти награды выдаются автоматически, один уровень - равен одному часу, так что для того чтобы получить все привилегии нужно провести всего 5 часов в голосовых каналах._\n`
                        + `**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\n\n`
                }); message2.react(`💜`)

                const message3 = await interaction.channel.send({
                    content:
                        `**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\n\n`
                        + `**Для участников которые хотят помочь нам финансово у нас есть подписка <@&${PREMIUM_ROLE_ID}> которая включает в себя возможность:**\n`
                        + `- заходить в полные комнаты\n`
                        + `- создать личную роль\n`
                        + `- создавать приватные ветки\n`
                        + `- 100 % получение приватной комнаты\n`
                        + `- а так же доступ к premium командам бота\n\n`
                        + `**Эти средства пойдут на оплату хостинга для нашего бота, рекламмы сервера и розыгрыши для участников сообщества.**\n`
                        + `**Стоимость подписки на **: \n`
                        + `**1 месяц**: 50 _грн._ или 100 _руб._\n`
                        + `**6 месяцев**: 250 _грн._ или 500 _руб._\n`
                        + `**12 месяцев**: 500 _грн._ 1000 _руб._\n\n`
                        + `_Для покупки премиум или получения дополнительной информации напишите_\n`
                        + `:flag_ua: <@326824247869833236>\n`
                        + `:flag_ru: <@409424976454877206>\n`
                        + `**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\n\n`
                }); message3.react('💛')

                const message4 = await interaction.channel.send({
                    content:
                        `**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\n\n`
                        + `**Хоть мы и позиционируем себя как сообщество для PUBG игроков - это не значит что мы тут больше ни чем не занимаемся...**\n`
                        + `Мы активно играем в другие игры, часто собираемся чтобы поиграть в настолки, посмотреть фильм или просто пообщаться.\n\n`
                        + `**Ты дочитал мое сообщение до конца - огромное тебе спасибо ** 💜 \n`
                        + `Надеюсь здесь ты найдешь себе новых друзей и приятно проведешь время!\n`
                        + `**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**`
                }); message4.react('💙')

                interaction.editReply({ content: `Готово.`, })
            } break;
        }
    },
};



