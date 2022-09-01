const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, Colors } = require("discord.js");
const { Rooms } = require('../../schemas/private-room');

module.exports = {
    category: 'public',
    data: new SlashCommandBuilder()
        .setName('my-room-rename')
        .setDescription('Переименовать вашу комнату.')
        .addStringOption(option => option
            .setName('название')
            .setDescription('Введите новое имя для вашей комнаты.')
            .setMaxLength(15)
            .setMinLength(3)
            .setRequired(true)
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction) {

        const { member, guild, options } = interaction;
        const roomName = options.getString('название');
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

        const Channel = guild.channels.cache.get(info.channelId);
        Channel.setName(`🕋︰${roomName}`)

        info.channelName = `🕋︰${roomName}`
        info.save();

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#2f3136`)
                    .setDescription(
                        `**Ваша комната переименована на  ${Channel}**\n`
                        + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                    )
            ]
        })
    },
};