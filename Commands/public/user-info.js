const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require("discord.js");
const { Times } = require('../../schemas/user-time');
const { User } = require('../../schemas/pubg-player');
const { toNormalTime } = require('../../utils/toNormalTime');
const { PREMIUM_ROLE_ID } = require('../../config.json');

module.exports = {
    category: 'public',
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('Информация о участнике сообщества.')
        .addUserOption(option => option
            .setName('участник')
            .setDescription('Выберите участника.')
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {

        const { member, guild, options } = interaction;
        const target = options.getMember('участник') || member;
        const db1 = await Times.findOne({ User: target.id });
        const db2 = await User.findOne({ discordId: target.id });

        let nickname; let premium; let link;

        if (db2?.pubgNickname) {
            nickname = `[${db2.pubgNickname}](https://pubg.op.gg/user/${db2.pubgNickname})`
        } else {
            nickname = `не зарегистрирован`
        };

        if (target.roles.cache.has(PREMIUM_ROLE_ID)) {
            premium = 'активно'
            link = `https://cdn.discordapp.com/attachments/972441100251963442/1014513080782299236/-1.png`
        } else {
            premium = 'отсутствует'
            link = null
        };

        const embed = new EmbedBuilder()
            .setColor(`#2f3136`)
            .setThumbnail(target.displayAvatarURL())
            .setAuthor({ name: target.user.username, iconURL: link })
            .setDescription(
                `**Premium**: ${premium}\n`
                + `**Игровой никнейм**: ${nickname}\n`
                + `**В голосовых**: ${toNormalTime(db1?.Time ? db1?.Time : 0)}\n`
                + `**Дата регистрации**: <t:${parseInt(target.user.createdTimestamp / 1000)}:R>\n`
                + `**Присоединился:** <t:${parseInt(target.joinedTimestamp / 1000)}:R>\n`
                + `**Роли**: ${target.roles.cache.map(r => r).join(" ").replace('@everyone', "") || 'без ролей'}\n`
                + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
            )
            .setTimestamp()

        interaction.reply({ embeds: [embed] });
    },
};