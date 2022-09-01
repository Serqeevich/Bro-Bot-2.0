const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, Colors } = require("discord.js");
const { Premium } = require('../../schemas/premium');

module.exports = {
    category: 'premium',
    data: new SlashCommandBuilder()
        .setName('role-create')
        .setDescription('Создать персональную роль.')
        .addStringOption(option => option
            .setName('название')
            .setDescription('Укажите название для вашей роли.')
            .setMinLength(3)
            .setMaxLength(20)
            .setRequired(true)
        )
        .addNumberOption(option => option
            .setName('цвет')
            .setDescription('Выберите цвет')
            .setRequired(true)
            .setChoices(
                { name: 'aqua', value: Colors.Aqua },
                { name: 'blue', value: Colors.Blue },
                { name: 'gold', value: Colors.Gold },
                { name: 'green', value: Colors.Green },
                { name: 'grey', value: Colors.Grey },
                { name: 'orange', value: Colors.Orange },
                { name: 'red', value: Colors.Red },
                { name: 'white', value: Colors.White },
                { name: 'yellow', value: Colors.Yellow },
                { name: 'purple', value: Colors.Purple },
                { name: 'blurple', value: Colors.Blurple },
                { name: 'fuchsia', value: Colors.Fuchsia },
                { name: 'navy', value: Colors.Navy },
                { name: 'dark-purple', value: Colors.DarkPurple },
                { name: 'dark-aqua', value: Colors.DarkAqua },
                { name: 'dark-green', value: Colors.DarkGreen },
                { name: 'dark-but-not-black', value: Colors.DarkButNotBlack },
                { name: 'dark-grey', value: Colors.DarkerGrey },
                { name: 'dark-vivid-pank', value: Colors.DarkVividPink },
                { name: 'dark-orange', value: Colors.DarkOrange },
                { name: 'not-quirt-black', value: Colors.NotQuiteBlack },
                { name: 'light-grey', value: Colors.LightGrey },
                { name: 'luminous-vivid-pank', value: Colors.LuminousVividPink },
                { name: 'dark-navy', value: Colors.DarkNavy },
                { name: 'default', value: Colors.Default },
            )
        )
        .addStringOption(option => option
            .setName('иконка')
            .setDescription('Вставьте иконку для вашей роли.')
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {

        const { guild, member, options } = interaction;

        const db = await Premium.findOne({ userId: member.id })
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

        if (db.roleId !== null) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setDescription(
                            `**У вас уже есть персональная роль <@&${db.roleId}>**\n`
                            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                        )
                ]
            })
        }

        const roleName = options.getString('название');
        const roleColor = options.getNumber('цвет');
        const roleIcon = options.getString('иконка');

        const role = await guild.roles.create({
            name: roleName,
            color: roleColor,
            unicodeEmoji: roleIcon ? roleIcon : null,
            hoist: false,
            mentionable: false,
            position: 52,
            reason: 'Создание своей роли',
        });

        db.roleId = role.id
        db.save();

        member.roles.add(role)

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#2f3136`)
                    .setDescription(
                        `**Для вас созданна роль ${role}**\n`
                        + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                    )
            ]
        })
    }
}