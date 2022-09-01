const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    category: 'pubg',
    data: new SlashCommandBuilder()
        .setName('secret-room')
        .setDescription('Карта секретных комнат taego и deston.')
        .addStringOption(option => option
            .setName('карта')
            .setDescription('Выберите карту.')
            .setRequired(true)
            .addChoices(
                { name: 'Taego', value: 'taego' },
                { name: 'Deston', value: 'deston' }
            )
        ),

    execute(interaction) {
        const choices = interaction.options.getString('карта');

        switch (choices) {
            case 'taego':
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#2f3136")
                            .setImage('https://cdn.discordapp.com/attachments/973994370401448007/999308949318795324/nfuj_d.png')
                    ],
                    components: [
                        new ActionRowBuilder().setComponents(
                            new ButtonBuilder()
                                .setURL('https://myserver.gg/ru/907628983577890886')
                                .setEmoji('💚')
                                .setStyle(ButtonStyle.Link),

                            new ButtonBuilder()
                                .setURL('https://cdn.discordapp.com/attachments/973994370401448007/999308949318795324/nfuj_d.png')
                                .setLabel('Посмотреть в полном размере')
                                .setStyle(ButtonStyle.Link)
                        )
                    ]
                })
                break;

            case 'deston':
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#2f3136")
                            .setImage('https://cdn.discordapp.com/attachments/973994370401448007/999303451941011576/Deston-goTop.png')
                    ],
                    components: [
                        new ActionRowBuilder().setComponents(
                            new ButtonBuilder()
                                .setURL('https://myserver.gg/ru/907628983577890886')
                                .setEmoji('💚')
                                .setStyle(ButtonStyle.Link),

                            new ButtonBuilder()
                                .setURL('https://cdn.discordapp.com/attachments/973994370401448007/999303451941011576/Deston-goTop.png')
                                .setLabel('Посмотреть в полном размере')
                                .setStyle(ButtonStyle.Link)
                        )
                    ]
                })

                break;
        }
    }
}