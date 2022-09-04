const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require('discord.js');
const { Members } = require('../../schemas/members');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clean-members')
        .setDescription('Очистить базу от вышедших участников.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {

        const { guild } = interaction;

        const db = await Members.find({});

        db.forEach(async (user) => {
            const member = guild.members.cache.get(user.userId);

            if (member) return console.log(`It's a member!`)

            if (!member) {
                console.log(`user delete`)
                user.delete();
            };
        });

        interaction.reply({ content: `Очистка заверешена.\nУдалено ${dbBefore - dbAfter} участников`, ephemeral: true })
    },
};