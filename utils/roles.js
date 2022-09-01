const { GuildMember, GuildMemberRoleManager } = require('discord.js');


exports.RANKS = {
    Master: 'Master',
    Diamond: 'Diamond',
    Platinum: 'Platinum',
    Gold: 'Gold',
    Silver: 'Silver',
    Bronze: 'Bronze',
    Unranked: 'Unranked',
};
exports.ADR = {
    '500': 'R.ADR 500+',
    '400': 'R.ADR 400+',
    '300': 'R.ADR 300+',
    '200': 'R.ADR 200+',
    '100': 'R.ADR 100+',
};
exports.KD = {
    '5': 'R.KD 5+',
    '4': 'R.KD 4+',
    '3': 'R.KD 3+',
    '2': 'R.KD 2+',
    '1': 'R.KD 1+',
};
exports.TPPADR = {
    '500': 'TPP ADR 500+',
    '400': 'TPP ADR 400+',
    '300': 'TPP ADR 300+',
    '200': 'TPP ADR 200+',
    '100': 'TPP ADR 100+',
};
exports.TPPKD = {
    '5': 'TPP KD 5+',
    '4': 'TPP KD 4+',
    '3': 'TPP KD 3+',
    '2': 'TPP KD 2+',
    '1': 'TPP KD 1+',
};
exports.FPPADR = {
    '500': 'FPP ADR 500+',
    '400': 'FPP ADR 400+',
    '300': 'FPP ADR 300+',
    '200': 'FPP ADR 200+',
    '100': 'FPP ADR 100+',
};
exports.FPPKD = {
    '5': 'FPP KD 5+',
    '4': 'FPP KD 4+',
    '3': 'FPP KD 3+',
    '2': 'FPP KD 2+',
    '1': 'FPP KD 1+',
};
const ROLES = [
    { name: exports.RANKS.Master, color: [0, 128, 0], hoist: true, mentionable: true },
    { name: exports.RANKS.Diamond, color: [30, 144, 255], hoist: true, mentionable: true },
    { name: exports.RANKS.Platinum, color: [70, 130, 180], hoist: true, mentionable: true },
    { name: exports.RANKS.Gold, color: [255, 165, 0], hoist: true, mentionable: true },
    { name: exports.RANKS.Silver, color: [192, 192, 192], hoist: true, mentionable: true },
    { name: exports.RANKS.Bronze, color: [139, 69, 19], hoist: true, mentionable: true },
    { name: exports.RANKS.Unranked, color: [47, 79, 79], hoist: true, mentionable: true },
    { name: exports.ADR['500'], color:[255, 255, 255], hoist: true, mentionable: true },
    { name: exports.ADR['400'], color:[255, 255, 255], hoist: true, mentionable: true },
    { name: exports.ADR['300'], color:[255, 255, 255], hoist: true, mentionable: true },
    { name: exports.ADR['200'], color:[255, 255, 255], hoist: true, mentionable: true },
    { name: exports.ADR['100'], color:[255, 255, 255], hoist: true, mentionable: true },
    { name: exports.KD['5'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.KD['4'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.KD['3'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.KD['2'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.KD['1'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.TPPADR['500'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.TPPADR['400'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.TPPADR['300'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.TPPADR['200'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.TPPADR['100'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.TPPKD['5'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.TPPKD['4'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.TPPKD['3'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.TPPKD['2'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.TPPKD['1'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.FPPADR['500'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.FPPADR['400'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.FPPADR['300'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.FPPADR['200'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.FPPADR['100'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.FPPKD['5'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.FPPKD['4'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.FPPKD['3'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.FPPKD['2'], color: [255, 255, 255], hoist: true, mentionable: true },
    { name: exports.FPPKD['1'], color: [255, 255, 255], hoist: true, mentionable: true },
];
const computeRoleNameFromStats = (role, stat, type, max) => {
    const statNumbers = Object.keys(role).map((value) => Number(value)); //300
    const statRoleClosest = findClosestNumber(statNumbers, stat);
    const statRole = statRoleClosest > max ? `+${max}` : statRoleClosest;
    return `${type} ${statRole}+`;
};

/**
 * 
 * @param {GuildMember} member 
 */
const removeRoles = async (member) => {
    const rolesToBeRemoved = member.roles.cache.filter((role) => {
        const statsRolesFound = ROLES.filter((r) => r.name === role.name);
        const statsRolesNameFound = statsRolesFound.map((roleFound) => roleFound.name);
        return statsRolesNameFound.includes(role.name);
    });
    const removeRolesPromises = rolesToBeRemoved.map((role) => member.roles.remove(role));
    await Promise.all(removeRolesPromises);
}; exports.removeRoles = removeRoles;

/**
 * 
 * @param {GuildMemberRoleManager} member 
 */
const addRoles = async (member, stats) => {
    let rankRoleName;
    let kdRoleName;
    let adrRoleName;

    if (stats.currentTierFpp == 'unranked') {
        rankRoleName = exports.RANKS['Unranked'];
    } else {
        rankRoleName = stats.currentTierFpp ? exports.RANKS[stats.currentTierFpp] : null;
        kdRoleName = stats.kdaFpp ? computeRoleNameFromStats(exports.KD, stats.kdaFpp, 'R.KD', 5) : null;
        adrRoleName = stats.adrFpp ? computeRoleNameFromStats(exports.ADR, stats.adrFpp, 'R.ADR', 500) : null;
    }
    const adrRoleNameTPP = stats.squadTppAdr ? computeRoleNameFromStats(exports.TPPADR, stats.squadTppAdr, 'TPP ADR', 500) : null;
    const kdRoleNameTPP = stats.squadTppKda ? computeRoleNameFromStats(exports.TPPKD, stats.squadTppKda, 'TPP KD', 5) : null;
    const adrRoleNameFPP = stats.squadFppAdr ? computeRoleNameFromStats(exports.FPPADR, stats.squadFppAdr, 'FPP ADR', 500) : null;
    const kdRoleNameFPP = stats.squadFppKda ? computeRoleNameFromStats(exports.FPPKD, stats.squadFppKda, 'FPP KD', 5) : null;

    const rolesNameToBeAssigned =
        [
            rankRoleName,
            adrRoleName,
            kdRoleName,
            adrRoleNameTPP,
            kdRoleNameTPP,
            adrRoleNameFPP,
            kdRoleNameFPP
        ]
            .filter((role) => role !== null);
            
    const roles = await member.guild.roles.fetch();
    const rolesToBeAssigned = roles.filter((role) => {
        return rolesNameToBeAssigned.includes(role.name);
    });
    const addRolesPromises = rolesToBeAssigned.map((role) => member.roles.add(role));
    await Promise.all(addRolesPromises);
};

const addStatsRoles = async (member, stats) => {
    await removeRoles(member);
    if (stats)
        await addRoles(member, stats);
};
exports.addStatsRoles = addStatsRoles;


exports.setupRoles = async (guild) => {
    const createRolesPromises = ROLES.filter((role) => {
        const alreadyExists = guild.roles.cache.find((r) => r.name === role.name, {});
        if (alreadyExists) {

            return false;
        }
        return guild.roles.create(role);
    });
    await Promise.all(createRolesPromises);
};


const findClosestNumber = (available, goal) => {
    let score = 0;
    available.forEach((v) => {
        if (goal >= v) {
            score = v;
        }
    });
    return score;
};
exports.findClosestNumber = findClosestNumber;
