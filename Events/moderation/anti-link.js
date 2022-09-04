const { Message, messageLink, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { WhiteList } = require('../../schemas/whiteList');
const { isInvite } = require('../../utils/isInvite');
const { Level_5, PREMIUM_ROLE_ID } = require('../../config.json');
const ms = require('ms')

module.exports = {
    name: 'messageCreate',
    /**
     * 
     * @param {Message} message 
     */
    async execute(message) {

        if (message.author.bot) return;

        if (message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return;

        if (message.member.roles.cache.has(Level_5) || message.member.roles.cache.has(PREMIUM_ROLE_ID)) return;

        try {
            const data = await WhiteList.findOne({ guildId: message.guild.id });
            for (const whiteLink of data.link) {
                if (message.content.includes(whiteLink)) {
                    console.log(`white list`);
                    return;
                };
            };
        } catch (error) {
            console.log(`White list не созданно в базе данных`)
        }


        const linkReg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
        const discordReg = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discord\.com\/invite)\/.+[a-z]/g;

        if (message.content.match(new RegExp(linkReg))) {

            if (message.content.match(new RegExp(discordReg))) {
                const code = message.content.split('discord.gg/')[1] || message.content.split('https://discord.com/invite/')[1];
                const isOurInvite = await isInvite(message.guild, code)
                if (!isOurInvite) {
                    await message.delete();
                    await message.member.timeout(1000 * 60 * 60 * 1, "ссылка на другой сервер.");
                    try {
                        await message.member.send({ embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`**Вам запрещенно публиковать ссылки**`)] });
                    } catch {
                        return;
                    }
                }
                return
            };

            await message.delete()

            try {

                await message.member.send({ embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`**Вам запрещенно публиковать ссылки**`)] });

            } catch {

                const msg = await message.channel.send({ embeds: [new EmbedBuilder().setColor(`#2f3136`).setDescription(`**Вам запрещенно публиковать ссылки**`)] })
                setTimeout(() => { msg.delete() }, 5000);

            };

        } else {
            return;
        };
    }
};