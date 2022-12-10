const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { Streamers } = require('../../schemas/streamers');
const { ROLE_STREAMER } = require('../../config.json');

module.exports = {
    category: 'administration',
    data: new SlashCommandBuilder()
        .setName('streamer-add')
        .setDescription('Добавить стримера.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option => option
            .setName('участник')
            .setDescription('Выберите участника которого нужно добавить.')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('канал')
            .setDescription('Укажите название twitch канала участника')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('ссылка')
            .setDescription('Укажите ссылку на канал участника')
            .setRequired(true)
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {

        const { options } = interaction;

        const member = options.getMember('участник');
        const channelName = options.getString('канал');
        const url = options.getString('ссылка');

        const check = await Streamers.findOne({ userId: member.id });
        if (check) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`2f3136`)
                        .setDescription(`**Участник  ${member} уже есть в списке стримеров**`)
                ],
                ephemeral: true
            })
        };

        const check2 = await Streamers.findOne({ channelName: channelName });
        if (check2) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`2f3136`)
                        .setDescription(`**Канал с названием ${channelName} уже есть в списке стримеров.**`)
                ],
                ephemeral: true
            });
        };

        await Streamers({
            userName: member.user.username,
            userId: member.id,
            channelName: channelName,
            link: url,
            status: null,
        }).save();

        member.roles.add(ROLE_STREAMER)

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(`2f3136`)
                    .setDescription(`**Участнику ${member} выдана роль <@&${ROLE_STREAMER}>**`)
            ],
            ephemeral: true
        });
    },
};