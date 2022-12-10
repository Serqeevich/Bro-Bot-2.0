const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { WhiteList } = require('../../schemas/whiteList');

module.exports = {
    category: 'moderation',
    data: new SlashCommandBuilder()
        .setName('add-link')
        .setDescription('Добавить ссылку в white list.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addStringOption(option => option
            .setName('ссылка')
            .setDescription('Укажите ссылку.')
            .setRequired(true)
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction) {
        const { options, guild } = interaction;
        const link = options.getString('ссылка');

        if (!link.includes('https://')) return interaction.reply({ content: `Укажите верную ссылку.`, ephemeral: true })

        await interaction.deferReply({ ephemeral: true });
        const embed = new EmbedBuilder()

        WhiteList.findOne({ guildId: guild.id }, async (err, data) => {
            if (err) throw err;
            if (!data) {
                await WhiteList.create({
                    guildId: guild.id,
                    link: link,
                });
                interaction.editReply({ embeds: [embed.setColor(`Green`).setDescription(`[Ссылка](${link}) добавлена в white list.`)] })
                return
            };

            for (const links of data.link) {
                if (links == link) {
                    interaction.editReply({ embeds: [embed.setColor(`Red`).setDescription(`Такая [ссылка](${link}) уже есть в white list.`)] })
                    return
                };
            };

            data.link.push(link)
            data.save();
            interaction.editReply({ embeds: [embed.setColor(`Green`).setDescription(`[Ссылка](${link}) добавлена в white list.`)] })
        });
    },
};