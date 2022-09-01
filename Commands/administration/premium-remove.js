const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { Premium } = require('../../schemas/premium');
const { PREMIUM_ROLE_ID } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('premium-remove')
        .setDescription(`Забрать у участника premium.`)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option => option
            .setName('участник')
            .setDescription('Выберите участника.')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('причина')
            .setDescription('Укажите причину')
            .setRequired(true)
        )
    ,

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction) {

        const { member, guild, options } = interaction;

        const user = options.getMember('участник');
        const reason = options.getString('причина');

        const db = await Premium.findOne({ userId: user.id });
        if (db == null) {
            return interaction.reply({ content: `Участника нет в базе.`, ephemeral: true })
        };

        const personalRole = guild.roles.cache.get(db.roleId)

        if (personalRole) {
            personalRole.delete();
        }

        user.roles.remove(PREMIUM_ROLE_ID);

        db.delete()

        try {
            await user.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setDescription(
                            `**Ваша Premium подписка удаленна!**\n\n`
                            + `**Причина**: ${reason}\n`
                            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                        ).setTimestamp()
                ]
            })

        } catch { }


        interaction.reply({ content: `Done`, ephemeral: true })
    },
};