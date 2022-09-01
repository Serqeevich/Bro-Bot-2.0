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
            + `**5.** \`/inrole\` - посмотреть участников с выбраной ролью.\n\n`
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
            + `**3.** \`/secret-room\` - карта с секретыми комнатами taego и deston.\n`
            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`


        if (member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            description +=
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
                + `💼 **Модерация**\n`
                + `**1.** \`/add-link\` - добавить ссылку в white list.\n`
                + `**2.** \`/clear-message\` - массовое удаление сообщений.\n`
                + `**3.** \`/move-members\` - массове перемещение участников.\n`
                + `**4.** \`/pubg-players\` - добавить или удалить игрока.\n`
        }

        if (member.permissions.has(PermissionFlagsBits.Administrator)) {
            description +=
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
                + `👮 **Администрация**\n`
                + `**1.** \`/streamers\` - список стримеров.\n`
                + `**2.** \`/streamer-add\` - добавить стримера.\n`
                + `**3.** \`/streamer-remove\` - удалить стримера.\n`
                + `**4.** \`/premium-add\` - добавить участнику Premium.\n`
                + `**5.** \`/premium-remove\` - удалить участнику Premium.\n`
                + `**6.** \`/send-message\` - отправить сообщение от имени бота.\n`
                + `**7.** \`/news\` - опубликовать новость.\n`
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