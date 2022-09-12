const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { Rooms } = require('../../schemas/private-room');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('private-rooms-delete')
        .setDescription('Удалить приватную комнату.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option => option
            .setName('участник')
            .setDescription('Выберите участника чью комнату нужно удалить.')
            .setRequired(true)
        )
    ,
    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction, client) {

        const { guild } = interaction;

        const user = interaction.options.getUser('участник');
        const db = await Rooms.findOne({ userId: user.id });

        if (!db) return interaction.reply({ content: "**Такая комната не найдена в базе данных**", ephemeral: true });

        const channel = guild.channels.cache.get(db.channelId)
        console.log(channel)

        await channel.delete();
        await db.delete();

        interaction.reply({ content: '**Комната удалена из баззы данных**', ephemeral: true })

    },
};