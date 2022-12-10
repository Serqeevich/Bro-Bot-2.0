const { SlashCommandBuilder, CommandInteraction, Client, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Информация о доступных вам командах.'),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {

        const { member } = interaction;

        let description =
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
            + `⭐ **Премиум команды**\n`
            + `**1.** \`/role-create\` - создать персональную роль.\n`
            + `**2.** \`/role-rename\` - переименовать вашу роль.\n`
            + `**3.** \`/role-color\` - изменить цвет вашей роли.\n`
            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
            + `🗯 **Общие**\n`
            + `**1.** \`/user-info\` - посмотреть информацию о участнике.\n`
            + `**2.** \`/vote-kick\` - создать голосование за исключение участника из канала.\n`
            + `**3.** \`/find-create\` - создать приглашение в поиск игроков.\n`
            + `**4.** \`/find-delete\` - удалить приглашение из поика игроков.\n`
            + `**5.** \`/inrole\` - посмотреть участников с выбраной ролью.\n`
            + `**6.** \`/leaderboard\` - топ 50 участиков.\n`
            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
            + `🔒 **Приватные комнаты**\n`
            + `**1.** \`my-room-info\` - информация о вашей комнате.\n`
            + `**2.** \`my-room-rename\` - переименовать вашу комнату.\n`
            + `**3.** \`my-room-add\` - дать участнику доступ к вашей комнате.\n`
            + `**4.** \`my-room-remove\` - забрать у участника доступ к вашей комнате.\n`
            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
            + `🪂 **PUBG: BATTLEGROUNDS**\n\n`
            + `_Чтобы привязать аккаунт используйте кнопку \`Привязать аккаунт\` в канале **роли**_\n\n`
            + `**1.** \`/update\` - обновить игровую статистику и роли.\n`
            + `**2.** \`/stat\` - посмотреть игровую статистику.\n`
            + `**3.** \`/top\` - Топ игроков в выбраном режиме.\n`
            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`


        if (member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            let a = 1;
            description +=
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
                + `💼 **Модерация**\n`
                + `**${a++}.** \`/add-link\` - добавить ссылку в white list.\n`
                + `**${a++}.** \`/clear-message\` - массовое удаление сообщений.\n`
                + `**${a++}.** \`/move-members\` - массове перемещение участников.\n`
                + `**${a++}.** \`/pubg-players\` - добавить или удалить игрока.\n`
        }

        if (member.permissions.has(PermissionFlagsBits.Administrator)) {
            let i = 1;
            description +=
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
                + `👮 **Администрация**\n`
                + `**${i++}.** \`/streamers\` - список стримеров.\n`
                + `**${i++}.** \`/streamer-add\` - добавить стримера.\n`
                + `**${i++}.** \`/streamer-remove\` - удалить стримера.\n`
                + `**${i++}.** \`/streamer-add-without-ds\` - добавить стримера которого нет на сервере.\n`
                + `**${i++}.** \`/streamer-remove-without-ds\` - удалить стримера которого нет на сервере.\n`
                + `**${i++}.** \`/premium\` - список Premium участников.\n`
                + `**${i++}.** \`/premium-add\` - добавить участнику Premium.\n`
                + `**${i++}.** \`/premium-remove\` - удалить участнику Premium.\n`
                + `**${i++}.** \`/premium-remove-id\` - удалить вышедшего участника из Premium базы данных.\n`
                + `**${i++}.** \`/private-rooms\` - список приватных комнат.\n`
                + `**${i++}.** \`/send-message\` - отправить сообщение от имени бота.\n`
                + `**${i++}.** \`/news\` - опубликовать новость.\n`
                + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
        }

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#2f3136`)
                    .setTitle(`Мои команды`)
                    .setDescription(description)
                    .setTimestamp()
                    .setFooter({
                        text: member.user.username,
                        iconURL: member.displayAvatarURL()
                    })
            ]
        })
    },
};