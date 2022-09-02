const { ModalSubmitInteraction, EmbedBuilder } = require('discord.js');
const { Verify } = require('../../schemas/verify');
const { Members } = require('../../schemas/members');
const { ROLE_RULES_ID, INFO_CHANNEL } = require('../../config.json');

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

            try {
                await member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#2f3136`)
                            .setDescription(
                                `**Поздравляю с успешной верификацией!**\n\n`
                                + `**Жми сюда** 👉  <#${INFO_CHANNEL}>\n`
                                + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                            )
                    ]
                })
            } catch {
                const channel = interaction.guild.channels.cache.get(INFO_CHANNEL);
                const message = await channel.send({
                    content: `<@${member.id}>`,
                    allowedMentions: { users: [member.id] },
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#2f3136`)
                            .setDescription(
                                `**Поздравляю с успешной верификацией!**\n\n`
                                + `**Пожалуйста прочитай информацию которая здесь написана**\n`
                                + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                            )
                    ]
                });

                setTimeout(() => {
                    message.delete();
                }, 30000);
            }

            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setDescription(
                            `**Вы успешно прошли верификацию**\n`
                            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                        )
                ]
            });
        };

        if (answer !== pinCode.pinCode) {
            await Verify.deleteOne({ userId: member.id });
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setDescription(
                            `**Повторите попытку!**\n`
                            + `**Вы ввели не верный код**\n`
                            + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                        )


                ]
            })
        };

    },
};