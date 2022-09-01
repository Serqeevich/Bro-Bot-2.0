const { VoiceState, Collection, EmbedBuilder, WebhookClient } = require('discord.js');
const { FIND_CHANNEL_ID } = require('../../config.json');
const { ERRORS_CHANNEL, ROLE_DEVELOPER } = require('../../config.json')
module.exports = {
    name: 'voiceStateUpdate',
    /**
     * 
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState  
     */

    async execute(oldState, newState, client) {

        try {

            const channels = new Collection();
            const { lfc } = client;

            const textChannel = newState.guild.channels.cache.get(FIND_CHANNEL_ID);

            if (oldState?.channel?.id != undefined) {
                channels.set(oldState.channel);
            };

            if (newState?.channel?.id != undefined) {
                channels.set(newState.channel);
            };

            for (let ch of channels) {
                if (lfc.has(ch[0].id)) {

                    const msgId = lfc.get(ch[0].id)
                    const embedMessage = await textChannel.messages.fetch(msgId);

                    if (!ch[0].members.size) {
                        await embedMessage.delete();
                        channels.delete(ch[0].id)
                        lfc.delete(ch[0].id)

                    } else {

                        const oldEmbed = embedMessage.embeds[0];
                        const oldContent = oldEmbed.description.split('\n\n');
                        const usersNeeded = ch[0].userLimit - ch[0].members.size;
                        const invite = await ch[0].createInvite();

                        let thumbnail = '';
                        switch (usersNeeded) {
                            case 0: thumbnail = 'https://cdn.discordapp.com/attachments/981126311126925322/981126969867534366/FULL.png'
                                break;

                            case 1: thumbnail = 'https://cdn.discordapp.com/attachments/981126311126925322/981126763860086824/1.png'
                                break;

                            case 2: thumbnail = 'https://cdn.discordapp.com/attachments/981126311126925322/981126764174655518/2.png'
                                break;

                            case 3: thumbnail = 'https://cdn.discordapp.com/attachments/981126311126925322/981126764489211964/3.png'
                                break;

                            default: thumbnail = 'https://cdn.discordapp.com/attachments/981126311126925322/981127112301903882/GOTOP.png'
                                break;
                        };

                        let content = `${oldContent[0]}\n\n`
                        let slotsCount = 1;

                        ch[0].members.forEach(user => {
                            if (content.length > 1000 || slotsCount > 10) {
                                content += `🔗 и еще ${ch[0].userLimit - slotsCount + 1} свободных мест.\n`
                            } else {
                                content += `🪂 <@${user.id}>\n`
                                slotsCount++
                            };
                        })

                        for (let i = 0; i < usersNeeded; i++) {
                            if (content.length > 1000 || slotsCount > 10) {
                                if (i != 0) {
                                    content += `и еще ${ch[0].userLimit - slotsCount + 1} свободных мест.\n`
                                    break;
                                };
                            } else {
                                content += `▫ \n`
                                slotsCount++
                            };
                        };

                        //content += `\n${oldContent[2]}`
                        content += `\n${usersNeeded != 0 ? `**[Подключиться:](${invite})  ${ch[0]}**` : '**Канал заполнен**'}\n`
                        content += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

                        const embed = new EmbedBuilder()
                            .setColor(`#2f3136`)
                            .setAuthor({
                                name: oldEmbed.author.name,
                                iconURL: oldEmbed.author.iconURL,
                                url: invite.toString()
                            })
                            .setThumbnail(thumbnail)
                            .setDescription(content)
                            .setTimestamp()
                            .setFooter({ text: usersNeeded != 0 ? `🟢 В поиске +${usersNeeded} игроков` : '🔴' })

                        embedMessage.edit({ embeds: [embed] })
                    }

                };
            };
        } catch (error) {
            new WebhookClient({ url: ERRORS_CHANNEL })
                .send({
                    content: `<@&${ROLE_DEVELOPER}>`,
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#2f3136`)
                            .setDescription(`Ошибка в обновлении поиска игроков!\n${error.name}\n\n${error.stack}`)
                    ],
                    allowedMentions: { roles: [ROLE_DEVELOPER] }
                })
        }
    },
};