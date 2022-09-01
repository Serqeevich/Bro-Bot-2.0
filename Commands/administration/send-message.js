const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require("discord.js");

module.exports = {
    category: 'administration',
    data: new SlashCommandBuilder()
        .setName('send-message')
        .setDescription('Отправить сообщение от имени бота.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option
            .setName('текст')
            .setDescription('Введите текст сообщения.')
            .setRequired(true)
            .setMaxLength(1950)
        ),
    /**
     * 
     * @param {CommandInteraction} intreaction 
     */
    async execute(intreaction) {

        const text = intreaction.options.getString('текст');

        await intreaction.channel.send({ content: text })
        intreaction.reply({ content: `Готово`, ephemeral: true })
    }
}