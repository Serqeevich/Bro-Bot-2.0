const axios = require('axios');
const { get } = require('lodash');
const { toHundred } = require('../utils/toHundred');
const { toPercent } = require('../utils/toPercent');

const pubg = axios.create({
    baseURL: 'https://api.playbattlegrounds.com/shards/steam',
    timeout: 10000,
    headers: {
        Authorization: `Bearer ${process.env.PUBG_API}`,
        Accept: 'application/vnd.api+json',
    },
});

const getCurrentSeason = async () => {
    const url = `/seasons`;
    try {
        const { data: { data: seasons }, } = await pubg.get(url);
        const currentSeason = seasons.find((season) => season.attributes.isCurrentSeason);
        return currentSeason;
    }
    catch (err) {
        throw new Error(err);
    }
};

const getRankedData = async (accountId, seasonId) => {
    const rankedUrl = `/players/${accountId}/seasons/${seasonId}/ranked`;
    const { data: { data }, } = await pubg.get(rankedUrl);
    return data;
};

const getPublicData = async (accountId, seasonId) => {
    const publicUrl = `/players/${accountId}/seasons/${seasonId}`;
    const { data: { data }, } = await pubg.get(publicUrl);
    return data;
};

const getPlayerStats = async (player) => {

    let results;

    try {
        const { id: seasonId } = await getCurrentSeason();

        const playerUrl = `/players?filter[playerNames]=${player}`;
        const { data: { data }, } = await pubg.get(playerUrl);
        const accountId = data[0].id;
        console.log(accountId)


        const rankedData = await getRankedData(accountId, seasonId);
        const rankStatsFpp = rankedData.attributes.rankedGameModeStats?.['squad-fpp'];
        const rankStatsTpp = rankedData.attributes.rankedGameModeStats?.['squad'];

        const publicData = await getPublicData(accountId, seasonId);
        const squadFppStats = publicData.attributes.gameModeStats?.['squad-fpp'];
        const squadTppStats = publicData.attributes.gameModeStats?.['squad'];
        const duoFppStats = publicData.attributes.gameModeStats?.['duo-fpp'];
        const duoTppStats = publicData.attributes.gameModeStats?.['duo'];
        const soloFppStats = publicData.attributes.gameModeStats?.['solo-fpp'];
        const soloTppStats = publicData.attributes.gameModeStats?.['solo'];

        const stats = {
            //Ranked FPP 
            currentTierFpp: get(rankStatsFpp, 'currentTier.tier', 'unranked'),
            currentSubTierFpp: get(rankStatsFpp, 'currentTier.subTier', 0),
            currentRankPointFpp: get(rankStatsFpp, 'currentRankPoint', 0),
            bestTierFpp: get(rankStatsFpp, 'bestTier.tier', 'unranked'),
            bestSubTierFpp: get(rankStatsFpp, 'bestTier.subTier', 0),
            bestPoinFpp: get(rankStatsFpp, 'bestRankPoint', 0),
            roundsPlayedFpp: get(rankStatsFpp, 'roundsPlayed', 0),
            damageDealtFpp: get(rankStatsFpp, 'damageDealt', 0),
            winsFpp: get(rankStatsFpp, 'wins', 0),
            winRatioFpp: toPercent(get(rankStatsFpp, 'winRatio', 0)),
            killsFpp: get(rankStatsFpp, 'kills', 0),
            assistsFpp: get(rankStatsFpp, 'assists', 0),
            kdaFpp: toHundred(get(rankStatsFpp, 'kda', 0)),
            adrFpp: Math.round((get(rankStatsFpp, 'damageDealt', 0) / get(rankStatsFpp, 'roundsPlayed', 0)) || 0),
            deathsFpp: get(rankStatsFpp, 'deaths', 0),
            //Ranked TPP 
            currentTierTpp: get(rankStatsTpp, 'currentTier.tier', 'unranked'),
            currentSubTierTpp: get(rankStatsTpp, 'currentTier.subTier', 0),
            currentRankPointTpp: get(rankStatsTpp, 'currentRankPoint', 0),
            bestTierTpp: get(rankStatsTpp, 'bestTier.tier', 'unranked'),
            bestSubTierTpp: get(rankStatsTpp, 'bestTier.subTier', 0),
            bestPoinTpp: get(rankStatsTpp, 'bestRankPoint', 0),
            roundsPlayedTpp: get(rankStatsTpp, 'roundsPlayed', 0),
            damageDealtTpp: get(rankStatsTpp, 'damageDealt', 0),
            winsTpp: get(rankStatsTpp, 'wins', 0),
            winRatioTpp: toPercent(get(rankStatsTpp, 'winRatio', 0)),
            killsTpp: get(rankStatsTpp, 'kills', 0),
            assistsTpp: get(rankStatsTpp, 'assists', 0),
            kdaTpp: toHundred(get(rankStatsTpp, 'kda', 0)),
            adrTpp: Math.round((get(rankStatsTpp, 'damageDealt', 0) / get(rankStatsTpp, 'roundsPlayed', 0)) || 0),
            deathsTpp: get(rankStatsTpp, 'deaths', 0),
            //Public Squad FPP
            squadFppRoundsPlayed: get(squadFppStats, 'roundsPlayed', 0),
            squadFppDamageDealt: get(squadFppStats, 'damageDealt', 0),
            squadFppWins: get(squadFppStats, 'wins', 0),
            squadFppKills: get(squadFppStats, 'kills', 0),
            squadFppAssists: get(squadFppStats, 'assists', 0),
            squadFppAdr: Math.round((get(squadFppStats, 'damageDealt', 0) / get(squadFppStats, 'roundsPlayed', 0)) || 0),
            squadFppKda: toHundred((get(squadFppStats, 'kills', 0) / (get(squadFppStats, 'roundsPlayed', 0) - get(squadFppStats, 'wins', 0)) || 0)),
            squadFppHeadShots: get(squadFppStats, 'headshotKills', 0),
            squadFppTeamKills: get(squadFppStats, 'teamKills', 0),
            squadFppLongestKill: toHundred(get(squadFppStats, 'longestKill', 0)),
            squadFppRoundMostKills: get(squadFppStats, 'roundMostKills', 0),
            squadFppDailyWins: get(squadFppStats, 'dailyWins', 0),
            //Public Squad TPP
            squadTppRoundsPlayed: get(squadTppStats, 'roundsPlayed', 0),
            squadTppDamageDealt: get(squadTppStats, 'damageDealt', 0),
            squadTppWins: get(squadTppStats, 'wins', 0),
            squadTppKills: get(squadTppStats, 'kills', 0),
            squadTppAssists: get(squadTppStats, 'assists', 0),
            squadTppAdr: Math.round((get(squadTppStats, 'damageDealt', 0) / get(squadTppStats, 'roundsPlayed', 0)) || 0),
            squadTppKda: toHundred((get(squadTppStats, 'kills', 0) / (get(squadTppStats, 'roundsPlayed', 0) - get(squadTppStats, 'wins', 0)) || 0)),
            squadTppHeadShots: get(squadTppStats, 'headshotKills', 0),
            squadTppTeamKills: get(squadTppStats, 'teamKills', 0),
            squadTppLongestKill: toHundred(get(squadTppStats, 'longestKill', 0)),
            squadTppRoundMostKills: get(squadTppStats, 'roundMostKills', 0),
            squadTppDailyWins: get(squadTppStats, 'dailyWins', 0),
            //Public Duo Fpp
            duoFppRoundsPlayed: get(duoFppStats, 'roundsPlayed', 0),
            duoFppDamageDealt: get(duoFppStats, 'damageDealt', 0),
            duoFppWins: get(duoFppStats, 'wins', 0),
            duoFppKills: get(duoFppStats, 'kills', 0),
            duoFppAssists: get(duoFppStats, 'assists', 0),
            duoFppAdr: Math.round((get(duoFppStats, 'damageDealt', 0) / get(duoFppStats, 'roundsPlayed', 0)) || 0),
            duoFppKda: toHundred((get(duoFppStats, 'kills', 0) / (get(duoFppStats, 'roundsPlayed', 0) - get(duoFppStats, 'wins', 0)) || 0)),
            duoFppHeadShots: get(duoFppStats, 'headshotKills', 0),
            duoFppTeamKills: get(duoFppStats, 'teamKills', 0),
            duoFppLongestKill: toHundred(get(duoFppStats, 'longestKill', 0)),
            duoFppRoundMostKills: get(duoFppStats, 'roundMostKills', 0),
            //Public Duo Tpp
            duoTppRoundsPlayed: get(duoTppStats, 'roundsPlayed', 0),
            duoTppDamageDealt: get(duoTppStats, 'damageDealt', 0),
            duoTppWins: get(duoTppStats, 'wins', 0),
            duoTppKills: get(duoTppStats, 'kills', 0),
            duoTppAssists: get(duoTppStats, 'assists', 0),
            duoTppAdr: Math.round((get(duoTppStats, 'damageDealt', 0) / get(duoTppStats, 'roundsPlayed', 0)) || 0),
            duoTppKda: toHundred((get(duoTppStats, 'kills', 0) / (get(duoTppStats, 'roundsPlayed', 0) - get(duoTppStats, 'wins', 0)) || 0)),
            duoTppHeadShots: get(duoTppStats, 'headshotKills', 0),
            duoTppTeamKills: get(duoTppStats, 'teamKills', 0),
            duoTppLongestKill: toHundred(get(duoTppStats, 'longestKill', 0)),
            duoTppRoundMostKills: get(duoTppStats, 'roundMostKills', 0),
            //Public Solo Fpp
            soloFppRoundsPlayed: get(soloFppStats, 'roundsPlayed', 0),
            soloFppDamageDealt: get(soloFppStats, 'damageDealt', 0),
            soloFppWins: get(soloFppStats, 'wins', 0),
            soloFppKills: get(soloFppStats, 'kills', 0),
            soloFppAssists: get(soloFppStats, 'assists', 0),
            soloFppAdr: Math.round((get(soloFppStats, 'damageDealt', 0) / get(soloFppStats, 'roundsPlayed', 0)) || 0),
            soloFppKda: toHundred((get(soloFppStats, 'kills', 0) / (get(soloFppStats, 'roundsPlayed', 0) - get(soloFppStats, 'wins', 0)) || 0)),
            soloFppHeadShots: get(soloFppStats, 'headshotKills', 0),
            soloFppTeamKills: get(soloFppStats, 'teamKills', 0),
            soloFppLongestKill: toHundred(get(soloFppStats, 'longestKill', 0)),
            soloFppRoundMostKills: get(soloFppStats, 'roundMostKills', 0),
            //Public Solo Tpp
            soloTppRoundsPlayed: get(soloTppStats, 'roundsPlayed', 0),
            soloTppDamageDealt: get(soloTppStats, 'damageDealt', 0),
            soloTppWins: get(soloTppStats, 'wins', 0),
            soloTppKills: get(soloTppStats, 'kills', 0),
            soloTppAssists: get(soloTppStats, 'assists', 0),
            soloTppAdr: Math.round((get(soloTppStats, 'damageDealt', 0) / get(soloTppStats, 'roundsPlayed', 0)) || 0),
            soloTppKda: toHundred((get(soloTppStats, 'kills', 0) / (get(soloTppStats, 'roundsPlayed', 0) - get(soloFppStats, 'wins', 0)) || 0)),
            soloTppHeadShots: get(soloTppStats, 'headshotKills', 0),
            soloTppTeamKills: get(soloTppStats, 'teamKills', 0),
            soloTppLongestKill: toHundred(get(soloTppStats, 'longestKill', 0)),
            soloTppRoundMostKills: get(soloTppStats, 'roundMostKills', 0),
        };
        return stats

    } catch (err) {
        if(err.name == 'TypeError') {
            return results = `type error`
        }
        if (err && err.response && err.response.status && err.response.status === 429) {
            return results = 'error 429';
        };
        if (err && err.response && err.response.status && err.response.status === 404) {
            return results = 'error 404';
        };
        if (err && err.response && err.response.status && err.response.status === 400) {
            return results = 'error 400';
        } else {
            console.log(err.name)
            return results = 'error unknown';
        }
    }
};
module.exports.getPlayerStats = getPlayerStats;