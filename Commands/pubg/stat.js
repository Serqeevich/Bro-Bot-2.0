const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require('discord.js');
const { User } = require('../../schemas/pubg-player');
const { switchToColor } = require('../../utils/switchToColor');
const { switchToTier } = require('../../utils/switchToTier');

module.exports = {
    category: 'pubg',
    data: new SlashCommandBuilder()
        .setName('stat')
        .setDescription('Просмотреть вашу игровую статистику или статистику другого участника.')
        .addUserOption(option =>
            option
                .setName('участник')
                .setDescription('Выберите участника чью статистику вы хотите посмотреть.')
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction) {

        const { member, options } = interaction;
        let target = options.getMember('участник') || member;

        const data = await User.findOne({ discordId: target.id });
        if (!data) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`**<@${target.id}> не зарегистрирован на сервере**`)
                ],
                ephemeral: true
            });
        };

        await interaction.deferReply();

        const embed = new EmbedBuilder()
            .setColor(switchToColor(data.stats.currentTierFpp || data.stats.currentTierTpp))
            .setAuthor({ name: target.user.username, iconURL: target.displayAvatarURL() })
            .setTitle(data.pubgNickname)
            .setURL(`https://pubg.op.gg/user/${data.pubgNickname}`)
            .setThumbnail(switchToTier(data.stats.currentTierFpp + data.stats.currentSubTierFpp || data.stats.currentTierTpp + data.stats.currentSubTierTpp))
            .setDescription(`**Последнее обновление статистики:** <t:${parseInt(data.updatedAt / 1000)}:R>`)
            .setFooter({ text: `Запросил ${member.user.username}`, iconURL: member.user.displayAvatarURL() })


        if (data.stats.roundsPlayedFpp >= 1) {
            let text =
                `**${data.stats.currentTierFpp} ${data.stats.currentSubTierFpp}**\n`
                + `> **Points**: ${data.stats.currentRankPointFpp}\n`
                + `> **Games**: ${data.stats.roundsPlayedFpp}\n`
                + `> **Wins**: ${data.stats.winsFpp}\n`
                + `> **Win-ratio**: ${data.stats.winRatioFpp}%\n`
                + `> **Kills**: ${data.stats.killsFpp}\n`
                + `> **Assists**: ${data.stats.assistsFpp}\n`
                + `> **Adr**: ${data.stats.adrFpp}\n`
                + `> **Kda**: ${data.stats.kdaFpp}\n`
                + `> **Deaths**: ${data.stats.deathsFpp}\n`
            embed.addFields({ name: `RANKED FPP`, value: text, inline: true });
        };

        if (data.stats.roundsPlayedTpp >= 1) {
            let text =
                `**${data.stats.currentTierTpp} ${data.stats.currentSubTierTpp}**\n`
                + `> **Points**: ${data.stats.currentRankPointTpp}\n`
                + `> **Games**: ${data.stats.roundsPlayedTpp}\n`
                + `> **Wins**: ${data.stats.winsTpp}\n`
                + `> **Win-ratio**: ${data.stats.winRatioTpp}%\n`
                + `> **Kills**: ${data.stats.killsTpp}\n`
                + `> **Assists**: ${data.stats.assistsTpp}\n`
                + `> **Adr**: ${data.stats.adrTpp}\n`
                + `> **Kda**: ${data.stats.kdaTpp}\n`
                + `> **Deaths**: ${data.stats.deathsTpp}\n`
            embed.addFields({ name: `RANKED TPP`, value: text, inline: true });
        };
        if (data.stats.squadFppRoundsPlayed >= 1) {
            let text =
                `> **Games**: ${data.stats.squadFppRoundsPlayed}\n`
                + `> **Wins**: ${data.stats.squadFppWins}\n`
                + `> **Kills**: ${data.stats.squadFppKills}\n`
                + `> **Assists**: ${data.stats.squadFppAssists}\n`
                + `> **Adr**: ${data.stats.squadFppAdr}\n`
                + `> **Kda**: ${data.stats.squadFppKda}\n`
                + `> **Head shots**: ${data.stats.squadFppHeadShots}\n`
                + `> **Team kills**: ${data.stats.squadFppTeamKills}\n`
                + `> **Longest**: ${data.stats.squadFppLongestKill}\n`
                + `> **Most kills**: ${data.stats.squadFppRoundMostKills}\n`
            embed.addFields({ name: `SQUAD FPP`, value: text, inline: true })
        };
        if (data.stats.squadTppRoundsPlayed >= 1) {
            let text =
                `> **Games**: ${data.stats.squadTppRoundsPlayed}\n`
                + `> **Wins**: ${data.stats.squadTppWins}\n`
                + `> **Kills**: ${data.stats.squadTppKills}\n`
                + `> **Assists**: ${data.stats.squadTppAssists}\n`
                + `> **Adr**: ${data.stats.squadTppAdr}\n`
                + `> **Kda**: ${data.stats.squadTppKda}\n`
                + `> **Head shots**: ${data.stats.squadTppHeadShots}\n`
                + `> **Team kills**: ${data.stats.squadTppTeamKills}\n`
                + `> **Longest**: ${data.stats.squadTppLongestKill}\n`
                + `> **Most kills**: ${data.stats.squadTppRoundMostKills}\n`
            embed.addFields({ name: `SQUAD TPP`, value: text, inline: true })
        };
        if (data.stats.duoFppRoundsPlayed >= 1) {
            let text =
                `> **Games**: ${data.stats.duoFppRoundsPlayed}\n`
                + `> **Wins**: ${data.stats.duoFppWins}\n`
                + `> **Kills**: ${data.stats.duoFppKills}\n`
                + `> **Assists**: ${data.stats.duoFppAssists}\n`
                + `> **Adr**: ${data.stats.duoFppAdr}\n`
                + `> **Kda**: ${data.stats.duoFppKda}\n`
                + `> **Head Shots**: ${data.stats.duoFppHeadShots}\n`
                + `> **Team kills**: ${data.stats.duoFppTeamKills}\n`
                + `> **Longest**: ${data.stats.duoFppLongestKill}\n`
                + `> **Most kills**: ${data.stats.duoFppRoundMostKills}\n`
            embed.addFields({ name: 'DUO FPP', value: text, inline: true })
        };
        if (data.stats.duoTppRoundsPlayed >= 1) {
            let text =
                `> **Games**: ${data.stats.duoTppRoundsPlayed}\n`
                + `> **Wins**: ${data.stats.duoTppWins}\n`
                + `> **Kills**: ${data.stats.duoTppKills}\n`
                + `> **Assists**: ${data.stats.duoTppAssists}\n`
                + `> **Adr**: ${data.stats.duoTppAdr}\n`
                + `> **Kda**: ${data.stats.duoTppKda}\n`
                + `> **Head Shots**: ${data.stats.duoTppHeadShots}\n`
                + `> **Team kills**: ${data.stats.duoTppTeamKills}\n`
                + `> **Longest**: ${data.stats.duoTppLongestKill}\n`
                + `> **Most kills**: ${data.stats.duoTppRoundMostKills}\n`
            embed.addFields({ name: 'DUO TPP', value: text, inline: true })
        };
        if (data.stats.soloFppRoundsPlayed >= 1) {
            let text =
                `> **Games**: ${data.stats.soloFppRoundsPlayed}\n`
                + `> **Wins**: ${data.stats.soloFppWins}\n`
                + `> **Kills**: ${data.stats.soloFppKills}\n`
                + `> **Assists**: ${data.stats.soloFppAssists}\n`
                + `> **Adr**: ${data.stats.soloFppAdr}\n`
                + `> **Kda**: ${data.stats.soloFppKda}\n`
                + `> **Head Shots**: ${data.stats.soloFppHeadShots}\n`
                + `> **Team kills**: ${data.stats.soloFppTeamKills}\n`
                + `> **Longest**: ${data.stats.soloFppLongestKill}\n`
                + `> **Most kills**: ${data.stats.soloFppRoundMostKills}\n`
            embed.addFields({ name: 'SOLO FPP', value: text, inline: true })
        };
        if (data.stats.soloTppRoundsPlayed >= 1) {
            let text =
                `> **Games**: ${data.stats.soloTppRoundsPlayed}\n`
                + `> **Wins**: ${data.stats.soloTppWins}\n`
                + `> **Kills**: ${data.stats.soloTppKills}\n`
                + `> **Assists**: ${data.stats.soloTppAssists}\n`
                + `> **Adr**: ${data.stats.soloTppAdr}\n`
                + `> **Kda**: ${data.stats.soloTppKda}\n`
                + `> **Head Shots**: ${data.stats.soloTppHeadShots}\n`
                + `> **Team kills**: ${data.stats.soloTppTeamKills}\n`
                + `> **Longest**: ${data.stats.soloTppLongestKill}\n`
                + `> **Most kills**: ${data.stats.soloTppRoundMostKills}\n`
            embed.addFields({ name: 'SOLO TPP', value: text, inline: true })
        };
        interaction.editReply({ embeds: [embed] })
    },
};