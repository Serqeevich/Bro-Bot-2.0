const { SlashCommandBuilder, CommandInteraction, Embed, EmbedBuilder, ChannelType } = require("discord.js");
const { ROLE_FIND_NOTIFY, FIND_CHANNEL_ID } = require('../../config.json');

module.exports = {
    category: 'public',
    data: new SlashCommandBuilder()
        .setName('find')
        .setDescription('Создать приглашение для вашего голосового канала.')
        .addStringOption(option => option
            .setName('комментарий')
            .setDescription('Вашш комментарий.')
            .setRequired(true)
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction, client) {

        try {

            const { lfc } = client;
            const { member, options, guild } = interaction;
            const comment = options.getString('комментарий');

            const linkReg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
            const discordReg = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discord\.com\/invite)\/.+[a-z]/g;

            if (!member.voice.channel) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#2f3136")
                            .setDescription(`🚫 **Вы должны находиться в голосовом канале**`)
                    ], ephemeral: true
                });
            };

            if (member.voice.channel.type == ChannelType.GuildStageVoice) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#2f3136`)
                            .setDescription(`🚫 **Вы не можете создать приглашение для этого канала**`)
                    ], ephemeral: true
                })
            };

            if (comment) {
                if (comment.includes(`*`) || comment.includes('_')) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(`#2f3136`)
                                .setDescription(`🚫 **Запрещено использовать символы \`*\` и \`_\` в комментарии к приглашению**`)
                        ], ephemeral: true
                    })
                };
            };

            if (comment.match(new RegExp(linkReg)) || comment.match(new RegExp(discordReg))) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#2f3136`)
                            .setDescription(`🚫 **Запрещено использовать ссылки в комментарии к приглашению**`)
                    ], ephemeral: true
                })
            };

            const textChannel = guild.channels.cache.get(FIND_CHANNEL_ID);

            const channel = member.voice.channel;
            const invite = await channel.createInvite();
            const usersNeeded = channel.userLimit - channel.members.size;

            let thumbnail;
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

            let content = '';
            content += `💬 ${comment}\n\n`
            let slotsCount = 1;

            channel.members.map(async (user) => {

                if (content.length > 1000 || slotsCount > 10) {
                    content += `🔗 и еще ${channel.userLimit - slotsCount + 1} свободных мест.\n`
                } else {
                    content += `🪂 <@${user.id}> \n`
                    slotsCount++
                }
            })

            for (let i = 0; i < usersNeeded; i++) {
                if (content.length > 1000 || slotsCount > 10) {
                    if (i != 0) {
                        content += `_и еще ${channel.userLimit - slotsCount + 1} свободных мест_\n`
                        break;
                    };
                } else {
                    content += `▫ \n`
                    slotsCount++
                }
            };

            content += `\n**[Подключиться:](${invite})  ${channel}**\n`
            content += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

            const embed = new EmbedBuilder()
                .setColor(`#2f3136`)
                .setAuthor({
                    name: `${member.user.username}`,
                    iconURL: member.displayAvatarURL(),
                    url: invite.toString(),
                })
                .setThumbnail(thumbnail)
                .setDescription(content)
                .setTimestamp()
                .setFooter({ text: `🟢 В поиске +${usersNeeded} игроков` })

            if (!lfc.has(channel.id)) {

                const message = await interaction.reply({ content: `<@&${ROLE_FIND_NOTIFY}>`, allowedMentions: { roles: [ROLE_FIND_NOTIFY] }, embeds: [embed], fetchReply: true });
                client.lfc.set(channel.id, message.id)

            } else {
                const msg = await textChannel.messages.fetch(lfc.get(channel.id))
                msg.edit({ embeds: [embed] })
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#2f3136`)
                            .setDescription(`✅ **Сообщение отредактированно**`)
                    ], ephemeral: true
                })
            };

        } catch {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setDescription(
                            `**Произошла ошибка**\n\n`
                            + `_Попробуйте пересоздать комнату_\n\n`
                            + `_Если вы постоянно получаете ошибку, пожалуйста сообщите об этом администратору_\n`
                            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                        )
                ], ephemeral: true
            })
        }
    },
};
