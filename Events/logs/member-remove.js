const { Client, GuildMember, WebhookClient, EmbedBuilder, AuditLogEvent, User } = require('discord.js');
const { Times } = require('../../schemas/user-time');
const { LOG_MEMBER_REMOVE } = require('../../config.json');
const { toNormalTime } = require('../../utils/toNormalTime');
const moment = require('moment');
moment.locale('ru');

module.exports = {
    name: 'guildMemberRemove',
    /**
     * 
     * @param {GuildMember} member
     * @param {Client} client
     */

    async execute(member) {
        const { guild, user } = member;
        const days = moment().to(member.joinedAt, true);
        const time = await Times.findOne({ User: member.id });

        new WebhookClient({ url: LOG_MEMBER_REMOVE })
            .send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setAuthor({
                            name: `${member.user.username} покинул сообщество`,
                            iconURL: member.displayAvatarURL({ forceStatic: true })
                        })
                        .setDescription(
                            `**Участник**: <@${member.id}>\n`
                            + `**ID**: ${member.id}\n`
                            + `**Время в голосовых**: ${toNormalTime(time?.Time ? time?.Time : '0')}\n`
                            + `**Пробыл на сервере**: ${days}\n`
                            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                        ).setTimestamp()
                        .setFooter({ text: `Участников на сервере ${member.guild.memberCount}`, })
                ]
            });

        // const fetchedLogs = await member.guild.fetchAuditLogs({
        //     limit: 1,
        //     type: AuditLogEvent.MemberKick,
        // })
        // const kickLog = fetchedLogs.entries.first();
        // if (!kickLog) return

        // const { executor, target, reason } = kickLog;
        // if (target.id === member.id) {

        //     // new WebhookClient({ url: BAN_KICK_MUTE_CHANNEL })
        //     //     .send({
        //     //         embeds: [
        //     //             new EmbedBuilder()
        //     //                 .setColor(`#2f3136`)
        //     //                 .setAuthor({
        //     //                     name: `${target.username} выгнан`,
        //     //                     iconURL: target.displayAvatarURL()
        //     //                 })
        //     //                 .setDescription(
        //     //                     `**Причина**: ${reason ? reason : 'не указана'}\n`
        //     //                     + `**Администратор**: <@${executor.id}>\n`
        //     //                     + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        //     //                 ).setTimestamp()
        //     //                 .setFooter({ text: '🔴' })
        //     //         ]
        //     //     })
        // };
    },
};