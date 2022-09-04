const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { User } = require('../../schemas/pubg-player');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('top-players')
        .setDescription('Топ PUBG игроков в выбраном режиме.')
        .addStringOption(option => option
            .setName('режим')
            .setDescription('Выберите режим.')
            .setRequired(true)
            .setChoices(
                { name: 'RANKED FPP', value: 'RANKED FPP' },
                { name: 'RANKED TPP', value: 'RANKED TPP' },
                { name: 'SQUAD FPP', value: 'SQUAD FPP' },
                { name: 'SQUAD TPP', value: 'SQUAD TPP' },
            )
        )
    ,
    async execute(interaction) {

        const { guild, options } = interaction;
        const choice = options.getString('режим');

        let players = await User.find({})
        const length = players.length;

        let i = 1; let text = '';

        switch (choice) {
            case 'RANKED FPP': {

                players = players.filter(function BigEnough(v) {
                    return v.stats.currentRankPointFpp
                        > 0
                });

                players = players.sort(function (a, b) {
                    return b.stats.currentRankPointFpp - a.stats.currentRankPointFpp;
                });
                players = players.slice(0, 10)

                players.forEach(p => {
                    const member = guild.members.cache.get(p.discordId);
                    if (member) {
                        text += `**${i++}.** **${member.user.username}** - **${p.stats.currentTierFpp}** _${p.stats.currentRankPointFpp}_\n` //${member.user.username}
                    }
                });

                text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

            } break;

            case 'RANKED TPP': {

                players = players.filter(function BigEnough(v) {
                    return v.stats.currentRankPointTpp
                        > 0
                });

                players = players.sort(function (a, b) {
                    return b.stats.currentRankPointTpp - a.stats.currentRankPointTpp;
                });
                players = players.slice(0, 10)

                players.forEach(p => {
                    const member = guild.members.cache.get(p.discordId);
                    if (member) {
                        text += `**${i++}.** **${member.user.username}** - **${p.stats.currentTierTpp}** _${p.stats.currentRankPointTpp}_\n`
                    }
                });

                text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

            } break;

            case 'SQUAD FPP': {
                players = players.filter(function BigEnough(v) {
                    return v.stats.squadFppAdr
                        > 0
                });

                players = players.sort(function (a, b) {
                    return b.stats.squadFppAdr - a.stats.squadFppAdr;
                });
                players = players.slice(0, 10)

                players.forEach(p => {
                    const member = guild.members.cache.get(p.discordId);
                    if (member) {
                        text += `**${i++}.** **${member.user.username}** - **${p.stats.squadFppAdr}** _adr_\n`
                    }
                });

                text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

            } break;

            case 'SQUAD TPP': {

                players = players.filter(function BigEnough(v) { return v.stats.squadTppAdr > 0 });
                players = players.sort(function (a, b) { return b.stats.squadTppAdr - a.stats.squadTppAdr; });
                players = players.slice(0, 10)

                players.forEach(p => {
                    const member = guild.members.cache.get(p.discordId);
                    if (member) {
                        text += `**${i++}.** **${member.user.username}** - **${p.stats.squadTppAdr}** _adr_\n`
                    }
                });

                text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

            } break;
        };

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#2f3136`)
                    .setTitle(`Топ 10 игроков в режиме ${choice}`)
                    .setDescription(text)
                    .setFooter({ text: `Участников в рейтинге ${length}` })
                    .setTimestamp()
            ], ephemeral: false
        })
    }
};