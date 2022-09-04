const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require('discord.js');
const { getPlayerStats } = require('../../API/pubg');
const { addStatsRoles } = require('../../utils/roles');
const { User } = require('../../schemas/pubg-player');

module.exports = {
    category: 'pubg',
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Обновить игровую статистику и роли.'),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction) {
        await interaction.deferReply({})
        const { guild, member } = interaction;

        const data = await User.findOne({ discordId: member.id });

        if (!data) {
            return interaction.editReply({ embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`**🚫 Вам нужно связать аккаунт дискорд с игровой учетной записью**`)] });
        };

        const newStats = await getPlayerStats(data.pubgNickname);

        switch (newStats) {
            case 'error 429': interaction.editReply({ embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription('**Слишком много запросов. Повторите попытку через 1 минуту**\n' + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)] }); break;
            case 'error 404': interaction.editReply({ embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`**Игрок с ником \` ${player} \` не найден**\n` + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)] }); break;
            case 'error 400': interaction.editReply({ embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`**Нет ответа от сервера**\n` + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)] }); break;
            case 'type error': interaction.editReply({ embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription('**Скорее всего вы не сменили расскладку клавиатуры**\n' + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)] }); break;
            case 'error unknown': interaction.editReply({ content: `**К сожаления произошла непредвиденая ошибка, повторите попытку. Если снова получите ошибку сообщите администратору. Спасибо!**` }); break;
            default:

                data.stats = newStats;
                data.updatedAt = new Date();
                data.save();

                await addStatsRoles(member, data.stats)

                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#2f3136`)
                            .setDescription(`**Вы успешно обновили игровую статистику и роли**\n` + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
                            .setTimestamp()
                    ]
                });
        };
    },
};