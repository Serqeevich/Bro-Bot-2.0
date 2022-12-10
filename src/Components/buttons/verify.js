const { ActionRowBuilder, TextInputBuilder, ModalBuilder, TextInputStyle, TextInputComponent } = require('discord.js');
const { Verify } = require('../../schemas/verify');
const { randomNumber } = require('../../utils/randomNumber');

module.exports = {
    id: 'verify',
    name: 'пройти верификацию',

    async execute(interaction) {

        const pinCode = randomNumber()
        const check = await Verify.findOne({ userId: interaction.member.id })

        if (check) {
            await check.delete();
            console.log(`new pin code`)
        };

        await Verify({
            userId: interaction.member.id,
            pinCode: pinCode,
        }).save();

        const modal = new ModalBuilder()
            .setCustomId('verify_modal')
            .setTitle(`Ваш код ${pinCode}`)
            .setComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('verify_modal_text')
                            .setLabel('введите ваш код')
                            .setPlaceholder('0000')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                            .setMinLength(4)
                            .setMaxLength(4),                        
                    )
            )
        interaction.showModal(modal);
    },
};