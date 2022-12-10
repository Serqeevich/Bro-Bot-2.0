const { ContextMenuCommandBuilder, ContextMenuCommandInteraction, ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { Rooms } = require('../../schemas/private-room');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Дать доступ к PR')
        .setType(ApplicationCommandType.User),
    /**
     * 
     * @param {ContextMenuCommandInteraction} interaction 
     */

    async execute(interaction) {

        const { member, options, guild, targetId } = interaction;

        const info = await Rooms.findOne({ userId: member.id });
        const newUser = targetId;


        if (!info) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setDescription(
                            `**У вас нет своей приватной комнаты**\n\n`
                            + `_Вы можете отправить запрос на создание комнаты в канале \`🔒︰info\`_\n`
                            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                        )
                ]
            });
        };

        let check2 = false;
        info.users.map((user) => {
            if (user == newUser) {
                check2 = true
            };
        })

        if (check2) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setDescription(`**<@${newUser}> уже имеет доступ к вашему каналу <#${info.channelId}>**`)
                ]
            })
        };

        const channel = guild.channels.cache.get(info.channelId);

        await channel.permissionOverwrites.edit(newUser, { Connect: true });

        try {
            await newUser.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setDescription(`**${member} дал вам доступ к каналу <#${info.channelId}>**`)
                ]
            });
        } catch { }

        info.users.push(newUser)
        info.save();

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#2f3136`)
                    .setDescription(`**<@${newUser}> получил доступ к вашему каналу <#${info.channelId}>**`)
            ]
        })

    }
};
