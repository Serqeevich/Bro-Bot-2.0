const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'public',
    data: new SlashCommandBuilder()
        .setName('inrole')
        .setDescription('new')
        .addRoleOption(option => option
            .setName('role')
            .setDescription('role')
            .setRequired(true)
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, member } = interaction;
        const role = options.getRole('role');

        let description = `**Участники с ролью ${role}**\n\n`

        role.members.map(u => {
            description += `<@${u.user.id}> **|** `
        })

        description += `\n**Показывать отдельно? ${role.hoist != false ? 'да' : 'нет'}**\n`
        description += `**Упоминания - ${role.mentionable != false ? 'разрешены' : 'запрещены'}**\n`

        description += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(role.color)
                    .setDescription(description)
                    .setFooter({
                        text: member.user.username,
                        iconURL: member.displayAvatarURL()
                    }).setTimestamp()

            ]
        })
    }
}