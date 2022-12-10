const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'moderation',
    data: new SlashCommandBuilder()
        .setName('move-members')
        .setDescription('Переместить всех участников из одного канала в другой.')
        .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers)
        .addChannelOption(option =>
            option
                .setName('откуда')
                .setDescription('из какого канала переместить участников...')
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(true)
        )
        .addChannelOption(option =>
            option
                .setName('куда')
                .setDescription('в какой канал переместить участников...')
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(true)
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {

        const { member, options } = interaction;
        const from = options.getChannel('откуда');
        const to = options.getChannel('куда');

        if (from === to) return interaction.reply({ content: '**Дурачек что-ли...**', ephemeral: true });

        if (from.members.size < 1) return interaction.reply({ content: `**В канале <#${from.id}> никого нет...**`, ephemeral: true });

        from.members.forEach(m => {
            m.voice.setChannel(to, `переместил ${member.user.tag}`)
        });

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Random')
                    .setDescription(`**Участники перемещены из канала <#${from.id}> в <#${to.id}>**`)
            ],
            ephemeral: true
        })
    },
};