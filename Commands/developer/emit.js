const { SlashCommandBuilder, CommandInteraction, Client, PermissionFlagsBits, } = require('discord.js');

module.exports = {
    category: "developer",
    data: new SlashCommandBuilder()
        .setName('emit-events')
        .setDescription('Эмитация событий.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
            option
                .setName('member')
                .setDescription('Guild member events')
                .setRequired(true)
                .addChoices(
                    { name: 'member add', value: 'guildMemberAdd' },
                    { name: 'member remove', value: 'guildMemberRemove' },
                    { name: 'member ban', value: 'guildBanAdd' },
                    { name: 'guildBanRemove', value: 'guildBanRemove' }
                )),

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {
        const { options, member } = interaction;
        const choices = options.getString('member');

        switch (choices) {
            case 'guildMemberAdd': {
                client.emit('guildMemberAdd', member);
                interaction.reply({ content: 'Guild member add - done!', ephemeral: true });
            }; break;

            case 'guildMemberRemove': {
                client.emit('guildMemberRemove', member);
                interaction.reply({ content: 'Guild member remove - done!', ephemeral: true });
            }; break;

            case 'guildBanAdd': {
                client.emit('guildBanAdd', member);
                interaction.reply({ content: 'Guild member ban - done!', ephemeral: true })
            }; break

            case 'guildBanRemove': {
                client.emit('guildBanRemove', member);
                interaction.reply({ content: 'Guild member remove ban - done!', ephemeral: true })
            }; break

        }
    },
};