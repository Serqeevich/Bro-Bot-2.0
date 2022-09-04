const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits, Colors } = require("discord.js");
const { Premium } = require('../../schemas/premium');
const { PREMIUM_ROLE_ID } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('premium-add')
        .setDescription(`Выдать участнику premium.`)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option => option
            .setName('участник')
            .setDescription('Выберите участника.')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('тариф')
            .setDescription('На сколько выдать premium')
            .setRequired(true)
            .setChoices(
                { name: '1 месяц', value: '1 месяц' },
                { name: '6 месяцев', value: '6 месяцев' },
                { name: 'на год', value: '1 год' },
            )
        )
        .addStringOption(option => option
            .setName('подарок')
            .setDescription(`Указать в случае если prenium в подарок.`)
            .setChoices(
                { name: 'да', value: 'в подарок' },
                { name: 'нет', value: ' ' }
            )
        )
    ,

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction) {

        const { member, guild, options } = interaction;

        const user = options.getMember('участник');
        const premiumPlan = options.getString('тариф');
        const gift = options.getString('подарок');

        const db = await Premium.findOne({ userId: user.id })
        if (db) {
            return interaction.reply({ content: `У участника ${user} уже есть Premium подписка.`, ephemeral: true })
        }

        await Premium.create({
            username: user.user.username,
            userId: user.id,
            plan: premiumPlan,
            date: Date.now(),
            roleId: null,
            admin: member.user.username
        });

        try {
            await user.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setDescription(
                            `**Большое спасибо за поддержку** 💛\n\n`
                            + `**Вам выдан Premium на ${premiumPlan} ${gift ? gift : ''}**\n\n`
                            + `_Теперь вам доступны premium команды бота и дополнительные возможности_\n`
                            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                        ).setTimestamp()
                ]
            })

        } catch { }

        user.roles.add(PREMIUM_ROLE_ID)


        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Gold)
                    .setDescription(
                        `**Участнику ${user} выдан Premium на ${premiumPlan} ${gift ? gift : ''}**\n`
                        + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                    )
            ]
        })
    },
};