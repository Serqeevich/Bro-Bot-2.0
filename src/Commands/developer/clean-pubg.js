const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require('discord.js');
const { User } = require('../../schemas/pubg-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clean-pubg-players')
        .setDescription('Очистить базу от вышедших игроков.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {

        const { guild } = interaction;

        const db = await User.find({});

        db.forEach(async (user) => {
            const member = guild.members.cache.get(user.discordId);

            if (member) return console.log(`It's a member!`)

            if (!member) {
                console.log(`user delete`)
                user.delete();
            };
        });

        interaction.reply({ content: `Очистка заверешена`, ephemeral: true })
    },
};