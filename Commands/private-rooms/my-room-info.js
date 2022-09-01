const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, Colors } = require("discord.js");
const { Rooms } = require('../../schemas/private-room');

module.exports = {
    category: 'public',
    data: new SlashCommandBuilder()
        .setName('my-room-info')
        .setDescription('Информация о вашей приватной комнате.'),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction) {

        const { member } = interaction;

        const info = await Rooms.findOne({ userId: member.id });
        console.log(info)


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

        let users = '';
        info.users.map(user => {
            users += `🔹 <@${user}>\n`
        });

        let description =
            `**Информация о комнате <#${info.channelId}>**\n\n`
            + `**Владелец**: <@${member.id}>\n`
            + `**Создана**: <t:${parseInt(info.createdAt / 1000)}:R>\n`
            + `**ID комнаты**: ${info.channelId}\n`
            + `**Участники**:\n${users ? users : 'пока никого...'}`

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Blurple)
                    .setThumbnail(member.displayAvatarURL())
                    .setDescription(description)
                    .setTimestamp()
            ]
        });
    },
};