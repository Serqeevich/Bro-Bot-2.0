const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, } = require("discord.js");
const { PermissionFlagsBits, Colors } = require('discord.js');

module.exports = {
    category: 'public',
    data: new SlashCommandBuilder()
        .setName('vote-kick')
        .setDescription('Создает голосование за исключение участника из вашего голосового канала.')
        .addUserOption(option =>
            option
                .setName('участник')
                .setDescription('Выберите участника которого вы хотите кикнуть.')
                .setRequired(true)
        ),
    /**
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction) {

        const { member, options } = interaction;
        const target = options.getMember('участник');

        if (!target.voice.channel) {
            return interaction.reply({ content: `**Участник не найден в голосовом канале.**`, ephemeral: true });
        };

        if (target.voice.channel !== member.voice.channel) {
            return interaction.reply({ content: '**Вы должны находиться в одном голосовом канале!**', ephemeral: true })
        };

        if (target.permissions.has(PermissionFlagsBits.Administrator) || target.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({ content: `**Вы не можете кикнуть даного пользователя.**`, ephemeral: true })
        };

        if (member.voice.channel.members.size == 2) {
            return interaction.reply({ content: `**Вы не можете голосовать в канале в котором только 2 участника.**`, ephemeral: true })
        };

        const users = member.voice.channel.members.size;
        const channel = member.voice.channel;
        const votesNeed = Math.round((users - 1) * 0.5 + 1);

        let memberMention = "";

        channel.members.each((user) => {
            if (user.id == target.id) {
                return;
            } else {
                memberMention += `<@${user.id}> `
            }
        });

        const message = await interaction.reply({
            content: memberMention,
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Yellow)
                    .setThumbnail(target.displayAvatarURL())
                    .setAuthor({
                        name: member.user.username,
                        iconURL: member.user.displayAvatarURL()
                    })
                    .setDescription(
                        `**начинает голосование за исключение <@${target.id}>**\n\n`
                        + `**Время на голосование:** _1 минута_\n`
                        + `**Нужно голосов**: _${votesNeed}_`
                    )
            ],
            fetchReply: true
        });

        const filterReactions = (reaction, user) => ['👍'].includes(reaction.emoji.name) && channel.members.map(m => user.id == m.id)  //to do только для участников комнаты
        message.react('👍');

        message.awaitReactions({ filterReactions, maxUsers: users, time: 1000 * 60 * 1 })
            .then(collected => {
                if (collected.get('👍').count > votesNeed) {
                    message.reactions.removeAll();

                    try {
                        target.voice.disconnect()
                    } catch { };

                    message.edit({
                        content: ' ',
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Green)
                                .setThumbnail(target.displayAvatarURL())
                                .setDescription(
                                    `**Голосование окончено - <@${target.id}> исключен.**\n\n`
                                    + `**Ему заблокирован доступ к каналу** ${channel.name}\n\n`
                                    + `**Набрано голосов**: ${(collected.get('👍').count) - 1}`
                                )
                                .setTimestamp()
                        ]
                    }).then(channel.permissionOverwrites.edit(target, { Connect: false }))
                };

                if (collected.get('👍').count <= votesNeed) {
                    message.reactions.removeAll()
                    return message.edit({
                        content: ' ',
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Red)
                                .setThumbnail(target.displayAvatarURL())
                                .setDescription(
                                    `**Голосование окончено - <@${target.id}> не исключен**.\n\n`
                                    + `**Нужно голосов**: ${votesNeed}\n`
                                    + `**Набрано голосов**: ${(collected.get('👍').count - 1)}`
                                )
                                .setTimestamp()
                        ]
                    });
                }
            })
    }
}