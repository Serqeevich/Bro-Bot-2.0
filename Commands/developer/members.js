const { CommandInteraction, Client, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Members } = require('../../schemas/members')

module.exports = {
    category: "developer",
    data: new SlashCommandBuilder()
        .setName('members')
        .setDescription('loop members')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option
            .setName('пароль')
            .setDescription('Введите пароль.')
            .setRequired(true)
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {

        const { guild, options } = interaction;

        const password = options.getString('пароль')
        const refferencePassword = '3131';

        if (password !== refferencePassword) return interaction.reply({ content: `**Не верный пароль...**`, ephemeral: true });


        await interaction.deferReply({ ephemeral: true })
        guild.members.cache.each(async (member) => {

            const db = await Members.findOne({ userId: member.id });

            if (db) {
                console.log(`already have this user in db`, member.user.username)
                return;
            };

            if (!db) {
                if (member.user.bot) return;

                await Members.create({
                    username: member.user.username,
                    userId: member.id,
                });
            };

            console.log(`Create a member`, member.user.username)
            await interaction.editReply({ content: `Create a member ${member.user.username} ` })
        });

        interaction.editReply({ content: `Done!` })
    },
};