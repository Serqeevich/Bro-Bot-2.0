const { ContextMenuCommandBuilder, ContextMenuCommandInteraction, ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { Rooms } = require('../../schemas/private-room');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Забрать доступ к PR')
        .setType(ApplicationCommandType.User),
    /**
     * 
     * @param {ContextMenuCommandInteraction} interaction 
     */

    async execute(interaction) {

        const { member, guild, targetId } = interaction;
        const oldUser = targetId;

        const info = await Rooms.findOne({ userId: member.id });


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

        info.users.forEach(u => {
            if (u == oldUser) {
                info.users.remove(u);
            };
        })
        info.save()

        const channel = guild.channels.cache.get(info.channelId);
        await channel.permissionOverwrites.edit(oldUser, { Connect: false });

        try {
            await oldUser.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setDescription(`**${member} закрыл вам доступ к каналу <#${info.channelId}>**`)
                ]
            });

        } catch { }

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#2f3136`)
                    .setDescription(`**Участнику <@${oldUser}> закрыт доступ к вашей комнате**`)
            ]
        });
    },
};
