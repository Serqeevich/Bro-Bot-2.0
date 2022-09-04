const { VoiceState, EmbedBuilder, } = require('discord.js');
const { Level_1, Level_2, Level_3, Level_4, Level_5, CHAT_CHANNEL_ID } = require('../../config.json');
const { Times } = require('../../schemas/user-time')
module.exports = {
    name: 'voiceStateUpdate',
    /**
     * 
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState
     */

    async execute(oldState, newState) {
        const oneHour = 3600000;
        const twoHour = 7200000;
        const threeHour = 10800000;
        const fourHour = 14400000
        const fiveHour = 18000000;

        const data = await Times.findOne({ User: oldState.member.id })
        if (!data) return

        const channel = oldState.guild.channels.cache.get(CHAT_CHANNEL_ID);
        const time = data.Time;

        if (!newState.channel && oldState.channel) {

            const { member } = oldState

            if (time >= oneHour && time < twoHour) {
                const check = await isAlreadyRole(member, Level_1);
                if (check) return
                await oldState.member.roles.add(Level_1)
                
                channel.send({
                    content: `${oldState.member}`,
                    allowedMentions: { users: [oldState.member.id] },
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#2f3136`)
                            .setThumbnail('https://cdn.discordapp.com/attachments/972441100251963442/1014799557860806696/happy-birthday-cat.gif')
                            .setDescription(
                                `**Поздравляю!**\n`
                                + `Вы получили <@&${Level_1}>\n\n`
                                + `_Теперь ваши GIF будут отображаться_\n`
                                + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                            )
                    ]
                })
            };



            if (time >= twoHour && time < threeHour) {
                const check = await isAlreadyRole(member, Level_2);
                if (check) return
                await oldState.member.roles.remove(Level_1)
                await oldState.member.roles.add(Level_2)

                channel.send({
                    content: `${oldState.member}`,
                    allowedMentions: { users: [oldState.member.id] },
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#2f3136`)
                            .setThumbnail('https://cdn.discordapp.com/attachments/972441100251963442/1014799155249557534/funny-woohoo.gif')
                            .setDescription(
                                `**Поздравляю!**\n`
                                + `Вы получили <@&${Level_2}>\n\n`
                                + `_Теперь вы можете запускать стримы_\n`
                                + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                            )
                    ]
                })
            };

            if (time >= threeHour && time < fourHour) {
                const check = await isAlreadyRole(member, Level_3);
                if (check) return
                await oldState.member.roles.remove(Level_2)
                await oldState.member.roles.add(Level_3)

                channel.send({
                    content: `${oldState.member}`,
                    allowedMentions: { users: [oldState.member.id] },
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#2f3136`)
                            .setThumbnail('https://cdn.discordapp.com/attachments/972441100251963442/1014798286084919297/baby-dance.gif')
                            .setDescription(
                                `**Поздравляю!**\n`
                                + `Вы получили <@&${Level_3}>\n\n`
                                + `_Теперь вы можете прикреплять файлы в чатах_\n`
                                + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                            )
                    ]
                })
            };

            if (time >= fourHour && time < fiveHour) {
                const check = await isAlreadyRole(member, Level_4);
                if (check) return
                await oldState.member.roles.remove(Level_3)
                await oldState.member.roles.add(Level_4)

                channel.send({
                    content: `${oldState.member}`,
                    allowedMentions: { users: [oldState.member.id] },
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#2f3136`)
                            .setThumbnail('https://cdn.discordapp.com/attachments/972441100251963442/1014797468329836564/will-ferrell-yes.gif')
                            .setDescription(
                                `**Поздравляю!**\n`
                                + `Вы получили <@&${Level_4}>\n\n`
                                + `_Теперь вы можете изменять себе никнейм_\n`
                                + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                            )
                    ]
                })
            };

            if (time >= fiveHour) {
                const check = await isAlreadyRole(member, Level_5);
                if (check) return
                await oldState.member.roles.remove(Level_4)
                await oldState.member.roles.add(Level_5)

                channel.send({
                    content: `${oldState.member}`,
                    allowedMentions: { users: [oldState.member.id] },
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#2f3136`)
                            .setThumbnail('https://cdn.discordapp.com/attachments/972441100251963442/1014548320338837504/champagne-hurrah.gif')
                            .setDescription(
                                `**Поздравляю!**\n`
                                + `Вы получили <@&${Level_5}>\n\n`
                                + `_Теперь вы можете публиковать ссылки_\n`
                                + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                            )
                    ]
                })
            };

        };

    },
};

const isAlreadyRole = async (member, role) => {
    return await new Promise((resolve) => {
        if (member.roles.cache.has(role)) {
            resolve(true)
            return
        }
        resolve(false)
    })
};

// `#2f3136`

// + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`