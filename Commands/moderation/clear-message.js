const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    category: 'moderation',
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Очистка сообщений.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option =>
            option
                .setName('кол-во')
                .setDescription('Укажите колличесвто сообщений от 1 до 100.')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
        )
        .addUserOption(option =>
            option
                .setName('участник')
                .setDescription('Укуажите автора сообщений')
                .setRequired(false)
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction) {

        const { channel, options } = interaction;

        const amount = options.getInteger('кол-во');
        const target = options.getMember('участник');
        const messages = await channel.messages.fetch();

        const response = new EmbedBuilder()
            .setColor('Blurple')

        if (target) {
            let i = 0;
            const filtered = [];
            (await messages).filter((m) => {
                if (m.author.id === target.id && amount > i) {
                    filtered.push(m)
                    i++
                };
            });

            await channel.bulkDelete(filtered, true)
                .then(messages => {
                    response.setDescription(`🧹 Очищенно ${messages.size} сообщений от участника ${target}`)
                    interaction.reply({ embeds: [response], ephemeral: true });
                });
        } else {
            await channel.bulkDelete(amount, true)
                .then(messages => {
                    response.setDescription(`🧹 **Очищенно ${messages.size} сообщений**`)
                    interaction.reply({ embeds: [response], ephemeral: true });
                });
        };
    },
};