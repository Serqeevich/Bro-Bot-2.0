const { GuildMember, WebhookClient, EmbedBuilder } = require('discord.js')
const { LOG_MEMBER_UPDATE, ROLE_RULES_ID } = require('../../config.json');

module.exports = {
    name: 'guildMemberUpdate',

    /**
     * @param {GuildMember} oldMember
     *  @param {GuildMember} newMember
     */

    async execute(oldMember, newMember) {

        let text = '';
        if (oldMember.nickname !== null && newMember.nickname !== oldMember.nickname && newMember.nickname !== null) {
            text += `**Изменяет никнейм на сервере с \` ${oldMember.nickname} \` на \` ${newMember.nickname} \`**\n`
        };
        if (oldMember.nickname == null && newMember.nickname !== null) {
            text += `**Добавляет себе никнейм \` ${newMember.nickname} \`**\n`
        };
        if (oldMember.nickname && !newMember.nickname) {
            text += `**Убирает себе никнейм \` ${oldMember.nickname} \`**\n`
        };

        const rolesAdded = newMember.roles.cache.filter(x => !oldMember.roles.cache.get(x.id));
        const rolesRemoved = oldMember.roles.cache.filter(x => !newMember.roles.cache.get(x.id));

        if (rolesAdded.size != 0) {
            const rolesAddArray = [];
            for (const role of [...rolesAdded.values()]) {
                rolesAddArray.push(role.toString());
            };

            if (rolesAddArray[0] == `<@&${ROLE_RULES_ID}>`) {
                text += `**Пройдена верификация** ✅\n\n`
            }
            text += `**Добавлена роль ${rolesAddArray.join(' ')}**\n`
        };

        if (rolesRemoved.size != 0) {
            const rolesRemoveArray = [];
            for (const role of [...rolesRemoved.values()]) {
                rolesRemoveArray.push(role.toString())
            };
            text += `**Убрана роль ${rolesRemoveArray.join(' ')}**\n`
        };


        let description = `${text}\n` + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        new WebhookClient({ url: LOG_MEMBER_UPDATE }).send({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#2f3136`)
                    .setAuthor({
                        name: `${newMember.user.username} изменен`,
                        iconURL: newMember.displayAvatarURL()
                    })
                    .setDescription(description)
                    .setTimestamp()
            ]
        })
    },
};

