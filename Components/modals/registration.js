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
                return interaction.editReply({ embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`**⛔ Под этим ником уже зарегистрирован пользователь <@${db.discordId}>**\n` + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)] })
            };
            if (db && db.discordId == interaction.member.id) {
                return interaction.editReply({ embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`**⛔ Вы уже зарегистрированы под ником [${db.pubgNickname}](https://pubg.op.gg/user/${db.pubgNickname})**\n` + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)] })
            };
        };
        db = await User.findOne({ discordId: interaction.member.id });
        if (db) {
            return interaction.editReply({ embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`**⛔ Вы уже зарегистрированы на сервере под ником [${db.pubgNickname}](https://pubg.op.gg/user/${db.pubgNickname})**\n` + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)] })
        };

        const stats = await getPlayerStats(player)
        switch (stats) {
            case 'error 429': interaction.editReply({ embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription('**Слишком много запросов. Повторите попытку через 1 минуту**\n' + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)] }); break;
            case 'error 404': interaction.editReply({ embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`**Игрок с ником \` ${player} \` не найден**\n` + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)] }); break;
            case 'error 400': interaction.editReply({ embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`**Нет ответа от сервера**\n` + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)] }); break;
            case 'type error': interaction.editReply({ embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription('**Скорее всего вы не сменили расскладку клавиатуры**\n' + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)] }); break;

            case 'error unknown': interaction.editReply({ content: `**К сожаления произошла непредвиденая ошибка, повторите попытку. Если снова получите ошибку сообщите администратору. Спасибо!**` }); break;
            default:
                User({
                    discordId: member.id,
                    pubgNickname: player,
                    stats: stats
                }).save();

                await addStatsRoles(member, stats)

                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#2f3136`)
                            .setDescription(
                                `**Вы успешно прошли регистрацию под ником [${player}](https://pubg.op.gg/user/${player})**\n`
                                + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                            )
                    ]
                })
        };
    },
};