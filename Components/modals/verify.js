const { ModalSubmitInteraction, EmbedBuilder } = require('discord.js');
const { Verify } = require('../../schemas/verify');
const { Members } = require('../../schemas/members');
const { ROLE_RULES_ID } = require('../../config.json');

module.exports = {
    id: 'verify_modal',
    /**
     * 
     * @param {ModalSubmitInteraction} interaction 
     */
    async execute(interaction) {

        await interaction.deferReply({ ephemeral: true });

        const { guild, fields, member } = interaction;

        const answer = fields.getTextInputValue('verify_modal_text');
        const pinCode = await Verify.findOne({ userId: member.id })


        if (answer === pinCode.pinCode) {

            member.roles.add(ROLE_RULES_ID)

            const newMember = await Members.findOne({ userId: member.id });
            if (newMember) {
                newMember.username = member.user.username;
                newMember.save();
                console.log(`update member`)
            };

            if (!newMember) {
                Members.create({
                    username: member.user.username,
                    userId: member.id,
                });
                console.log(`create member`)
            };

            await Verify.deleteOne({ userId: member.id });

            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setAuthor({
                            name: `Вы успешно прошли регистрацию`,
                            iconURL: `https://cdn.discordapp.com/attachments/972441100251963442/1005435901301755994/52871_tips_icon.png`
                        })
                ]
            })
        };

        if (answer !== pinCode.pinCode) {
            await Verify.deleteOne({ userId: member.id });
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setAuthor({
                            name: `Вы ввели не верный код. Повторите попытку`,
                            iconURL: `https://cdn.discordapp.com/attachments/972441100251963442/1005426487995936818/52876_error_icon.png`
                        })
                ]
            })
        };

    },
};