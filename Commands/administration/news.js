const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, Attachment } = require("discord.js");
const { NEWS_CHANNLE_ID, ROLE_NEWS_NOTIFY } = require('../../config.json');

module.exports = {
    category: 'administration',
    data: new SlashCommandBuilder()
        .setName('news')
        .setDescription('Опубликовать новость в канал новости.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option
            .setName('сообщение')
            .setDescription('Опишите новость.')
            .setRequired(true)
        )
        .addAttachmentOption(option => option
            .setName(`вложение`)
            .setDescription('Выберите ккартинку.')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('строка')
            .setDescription('Новая строчка.')
        )
        .addStringOption(option => option
            .setName('url')
            .setDescription('Вставьте ссылку на ресурс.')
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction) {

        const { guild, options } = interaction;
        const channel = guild.channels.cache.get(NEWS_CHANNLE_ID);
        const text = options.getString('сообщение');
        const text2 = options.getString('строка');

        const attachment = new Attachment(options.getAttachment('вложение'))
        const url = options.getString('url');

        interaction.deferReply({ ephemeral: true })

        let description =
            `**Приветствую!**\n\n`
            + `${text}\n`
            + `${text2 ? text2 : ''}\n\n`
            + `<@&${ROLE_NEWS_NOTIFY}>\n`
            + `${url ? url : ''}`

        const message = await channel.send({
            content: description,
            files: [attachment],
            allowedMentions: { roles: [ROLE_NEWS_NOTIFY] },
        })
        message.react('💛')

        interaction.editReply({ content: `✅ | **Сообщение отправлено.**`, ephemeral: true })

    },
};