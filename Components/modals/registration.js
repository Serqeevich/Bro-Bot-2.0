const { ModalSubmitInteraction, PermissionFlagsBits, EmbedBuilder, Embed } = require('discord.js');
const { User } = require('../../schemas/pubg-player');
const { getPlayerStats } = require('../../API/pubg');
const { addStatsRoles } = require('../../utils/roles');

module.exports = {
    id: 'reg_modal',
    /**
     * 
     * @param {ModalSubmitInteraction} interaction 
     */

    async execute(interaction) {

        const { guild, fields, member } = interaction;

        await interaction.deferReply({ ephemeral: true })
        const player = fields.getTextInputValue(`reg_modal_text`);

        let db = await User.findOne({ pubgNickname: player });
        if (db) {
            if (db.discordId != interaction.member.id) {
                return interaction.editReply({ embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`**⛔ Под этим ником уже зарегистрирован пользователь <@${db.discordId}>**`)] })
            };
            if (db && db.discordId == interaction.member.id) {
                return interaction.editReply({ embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`**⛔ Вы уже зарегистрированы под ником [${db.pubgNickname}](https://pubg.op.gg/user/${db.pubgNickname})**`)] })
            };
        };
        db = await User.findOne({ discordId: interaction.member.id });
        if (db) {
            return interaction.editReply({ embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`**⛔ Вы уже зарегистрированы на сервере под ником [${db.pubgNickname}](https://pubg.op.gg/user/${db.pubgNickname})**`)] })
        };

        const stats = await getPlayerStats(player)
        switch (stats) {
            case 'error 429': interaction.editReply({ content: '**Слишком много запросов. Повторите попытку через 1 минуту.**' }); break;
            case 'error 404': interaction.editReply({ content: `**Игрок с ником ${player} не найден.**` }); break;
            case 'error 400': interaction.editReply({ content: `**Нет ответа от сервера.**` }); break;
            case 'type error': interaction.editReply({ content: '**Смените раскладку клавиатуры**' }); break;

            case 'error unknown': interaction.editReply({ content: `**К сожаления произошла непредвиденая ошибка, повторите попытку. Если снова получите ошибку сообщите администратору. Спасибо!**` }); break;
            default:
                User({
                    discordId: member.id,
                    pubgNickname: player,
                    stats: stats
                }).save();

                await addStatsRoles(member, stats)

                interaction.editReply({ embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`**Вы успешно прошли регистрацию под ником [${player}](https://pubg.op.gg/user/${player})**`)] })
        };
    },
};