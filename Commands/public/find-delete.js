const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require("discord.js");
const { FIND_CHANNEL_ID } = require('../../config.json');

module.exports = {
    category: 'public',
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Удалить ваше сообщение в поиске игроков.'),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction, client) {
        const { lfc } = client;
        const { member, guild } = interaction;

        const channel = member.voice.channel;

        if (!channel) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setDescription(`**Вы должны находиться в голосовом канале**`)
                ], ephemeral: true
            })
        };


        if (lfc.has(channel.id)) {

            const textChannel = guild.channels.cache.get(FIND_CHANNEL_ID);
            const message = await textChannel.messages.fetch(lfc.get(channel.id))

            await message.delete();
            lfc.delete(channel.id)

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setDescription(`**Приглашение для вашего канала удалено**`)
                ], ephemeral: true, ephemeral: true
            });

        } else {

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#2f3136`)
                        .setDescription(`**Для этого канала не создано приглашений**`)
                ], ephemeral: true, ephemeral: true
            });
        };

    },
};