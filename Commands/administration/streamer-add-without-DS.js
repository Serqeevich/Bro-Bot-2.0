const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { Streamers } = require('../../schemas/streamers');

module.exports = {
    category: 'administration',
    data: new SlashCommandBuilder()
        .setName('streamer-add-without-ds')
        .setDescription('Добавить стримера которого нет на сервере.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option
            .setName('канал')
            .setDescription('Укажите название twitch канала участника')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('ссылка')
            .setDescription('Укажите ссылку на канал участник')
            .setRequired(true)
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {

        const { options } = interaction;

        const channelName = options.getString('канал');
        const url = options.getString('ссылка');

        const check = await Streamers.findOne({ channelName: channelName });
        if (check) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`2f3136`)
                        .setDescription(`**Участник  ${channelName} уже есть в списке стримеров**`)
                ],
                ephemeral: true
            })
        };

        await Streamers({
            channelName: channelName,
            link: url,
            status: null,
        }).save();


        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(`2f3136`)
                    .setDescription(`**Канал  ${channelName} добавлен в список**`)
            ],
        });

    },
};