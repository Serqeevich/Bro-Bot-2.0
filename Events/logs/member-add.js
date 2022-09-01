const { GuildMember, Client, EmbedBuilder, WebhookClient, Colors } = require('discord.js');
const { LOG_MEMBER_ADD } = require('../../config.json');

module.exports = {
    name: 'guildMemberAdd',
    /**
     * 
     * @param {GuildMember} member
     * @param {Client} client
     */

    async execute(member) {

        new WebhookClient({ url: LOG_MEMBER_ADD })
            .send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setAuthor({
                            name: `${member.user.username} присоедилися к сообществу`,
                            iconURL: member.displayAvatarURL({ forceStatic: true })
                        })
                        .setDescription(
                            `**Никнейм**: ${member.user.username}\n`
                            + `**Аватар**: [link](${member.displayAvatarURL()})\n`
                            + `**ID**: ${member.id}\n`
                            + `**Дата регистрации**: <t:${parseInt(member.user.createdTimestamp / 1000)}:R>\n`
                            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                        ).setTimestamp()
                        .setFooter({ text: `Участников на сервере ${member.guild.memberCount}`, })
                ]
            })
    },
};