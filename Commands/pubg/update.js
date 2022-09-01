const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require('discord.js');
const { getPlayerStats } = require('../../API/pubg');
const { addStatsRoles } = require('../../utils/roles');
const { User } = require('../../schemas/pubg-player');
const { DailyUpdates } = require('../../schemas/daily-update');

let claimedCache = [];

const clearCache = () => {
    claimedCache = []
    setTimeout(clearCache, 1000 * 60 * 60)
};
clearCache();

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
        await interaction.deferReply({ ephemeral: true })
        const { guild, member } = interaction;

        const data = await User.findOne({ discordId: member.id });

        if (!data) {
            return interaction.editReply({ embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`**🚫 Вам нужно связать аккаунт дискорд с игровой учетной записью**`)] });
        };

        if (claimedCache.includes(member.id)) {
            console.log('from cache bot')
            return interaction.editReply({ content: `**Вы сегодня уже обновляли свою статистику <t:${parseInt(data.updatedAt / 1000)}:R>**` })
        };

        const obj = {
            guildId: guild.id,
            userId: member.id
        };

        try {

            const results = await DailyUpdates.findOne(obj);

            if (results) {
                const then = new Date(results.updatedAt).getTime()
                const now = new Date().getTime()
                const diffTime = Math.abs(now - then)
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

                if (diffDays <= 1) {
                    claimedCache.push(member.id);
                    return interaction.editReply({ content: `**Вы сегодня уже обновляли свою статистику <t:${parseInt(data.updatedAt / 1000)}:R>**` })
                };
            };

            const newStats = await getPlayerStats(data.pubgNickname);
            switch (newStats) {
                case 'error 429': interaction.editReply({ content: '**Слишком много запросов. Повторите попытку через 1 минуту.**' }); break;
                case 'error 404': interaction.editReply({ content: `**Игрок с ником ${player} не найден.**` }); break;
                case 'error 400': interaction.editReply({ content: `**Нет ответа от сервера.**` }); break;
                case 'error unknown': interaction.editReply({ content: `**Что-то пошло не так...**` }); break;
                default:

                    await DailyUpdates.findOneAndUpdate(obj, obj, { upsert: true });
                    claimedCache.push(member.id);

                    data.stats = newStats;
                    data.updatedAt = new Date();
                    data.save();

                    await addStatsRoles(member, data.stats)

                    interaction.editReply({ content: `Вы успешно обновили статистику.` });
            };

        } catch (err) {
            console.error(err)
        };
    }
};