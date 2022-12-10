const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require('discord.js');
const { User } = require('../../schemas/pubg-player');
const { getPlayerStats } = require('../../API/pubg');
const { addStatsRoles, removeRoles } = require('../../utils/roles');

module.exports = {
    category: 'moderation',
    data: new SlashCommandBuilder()
        .setName('pubg-player')
        .setDescription('Добавить или удалить участника.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)

        .addSubcommand(option => option
            .setName('добавить')
            .setDescription('Зарегистрировать участника.')
            .addUserOption(option => option
                .setName('участник')
                .setDescription('Выберите участника сервера.')
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName('никнейм')
                .setDescription('Укажите игровой никнейм участника.')
                .setMinLength(0)
                .setMaxLength(16)
                .setRequired(true)
            )
        )
        .addSubcommand(option => option
            .setName('удалить')
            .setDescription('Удалить участника из db и удалить его роли.')
            .addStringOption(option => option
                .setName('никнейм')
                .setDescription('Укажите nickname участника.')
                .setRequired(true)
            )
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction) {
        const { options, guild } = interaction;
        const subcommand = options.getSubcommand();

        switch (subcommand) {
            case 'добавить': {
                await interaction.deferReply({ ephemeral: true })
                const player = options.getMember('участник');
                const nickname = options.getString('никнейм');

                const oldPlayer = await User.findOne({ pubgNickname: nickname });
                if (oldPlayer) {
                    try {
                        const oldMember = await guild.members.fetch(oldPlayer.discordId);
                        await removeRoles(oldMember)
                    } catch { };
                    await User.deleteOne({ pubgNickname: nickname })
                    interaction.editReply({ content: `Участник удален.` })
                };

                const stats = await getPlayerStats(nickname);
                switch (stats) {
                    case 'error 429': interaction.editReply({ content: '**Слишком много запросов. Повторите попытку через 1 минуту.**' }); break;
                    case 'error 404': interaction.editReply({ content: `**Игрок с ником ${nickname} не найден.**` }); break;
                    case 'error 400': interaction.editReply({ content: `**Нет ответа от сервера.**` }); break;
                    case 'error unknown': interaction.editReply({ content: `**Что-то пошло не так...**` }); break;
                    default:

                        await User({
                            discordId: player.id,
                            pubgNickname: nickname,
                            stats: stats
                        }).save();
                        await addStatsRoles(player, stats);

                        interaction.editReply({ content: `Участник <@${player.id}> успешно зарегистрирорван под ником ${nickname}!` })

                }; break;

            } break;

            case 'удалить': {

                await interaction.deferReply({ ephemeral: true });
                const { guild } = interaction;
                const nickname = options.getString('никнейм');
                
                const oldPlayer = await User.findOne({ pubgNickname: nickname });
                
                if (!oldPlayer) {
                    return interaction.editReply({ content: `Такой игрок не зарегистрирован.` })
                };

                try {
                    const oldMember = await guild.members.fetch(oldPlayer.discordId);
                    
                    await removeRoles(oldMember);
                } catch { };

                await User.deleteOne({ pubgNickname: nickname });

                interaction.editReply({ content: `Участник удален из базы даннных.` })

            }; break;

        };
    },
};