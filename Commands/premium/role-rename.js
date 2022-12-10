const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require("discord.js");
const { Premium } = require('../../schemas/premium');

module.exports = {
    category: 'premium',
    data: new SlashCommandBuilder()
        .setName('role-rename')
        .setDescription('Переименовать вашу персональную роль.')
        .addStringOption(option => option
            .setName('название')
            .setDescription('Укажите название для вашей роли.')
            .setMinLength(3)
            .setMaxLength(20)
            .setRequired(true)
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {

        const { guild, member, options } = interaction;
        const roleName = options.getString('название');

        const db = await Premium.findOne({ userId: member.id });
        if (!db) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setDescription(
                            `**У вас нет Premium подписки для использования этой команды**\n`
                            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                        )
                ]
            })
        };

        if (db.roleId == null) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setDescription(
                            `**Вы еще не создавали для себя персональную роль**\n`
                            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                        )
                ]
            })
        };

        const personalRole = guild.roles.cache.get(db.roleId);
        console.log(personalRole)
        await personalRole.setName(roleName)

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#2f3136`)
                    .setDescription(
                        `**Вы переименовали роль на ${personalRole}**\n`
                        + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                    )
            ]
        })
    }
}