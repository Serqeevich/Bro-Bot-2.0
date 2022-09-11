const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, Colors } = require("discord.js");
const { Rooms } = require('../../schemas/private-room');

module.exports = {
    category: 'public',
    data: new SlashCommandBuilder()
        .setName('my-room-add')
        .setDescription('Предоставить участнику доступ к вашей приватной комнате.')
        .addUserOption(option => option
            .setName('участник')
            .setDescription('Выберите участника которого вы хотите добавить.')
            .setRequired(true)
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction) {

        const { member, options, guild } = interaction;

        const info = await Rooms.findOne({ userId: member.id });
        const newUser = options.getUser('участник');


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
            if (user == newUser.id) {
                check2 = true
            };
        })

        if (check2) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setDescription(`**<@${newUser.id}> уже имеет доступ к вашему каналу <#${info.channelId}>**`)
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

        info.users.push(newUser.id)
        info.save();

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#2f3136`)
                    .setDescription(`**<@${newUser.id}> получил доступ к вашему каналу <#${info.channelId}>**`)
            ]
        })

    },
};