const { VoiceState, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { User } = require('../../schemas/pubg-player')
const { TPP_CHANNEL_ID, FPP_CHANNEL_ID, DUO_CHANNEL_ID, RANK_CHANNEL_ID, GAMES_CHANNEL_ID, WAITING_ROOM } = require('../../config.json');
const { TPP_CATEGORY_ID, FPP_CATEGORY_ID, DUO_CATEGORY_ID, RANK_CATEGORY_ID, GAMES_CATEGORY_ID } = require('../../config.json');

//Создаем базу кулдаунов
const Cooldown = new Map();

module.exports = {
    name: 'voiceStateUpdate',

    /**
     * 
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState 
     */

    async execute(oldState, newState, client) {

        //находим комнату ожидания
        const waitingRoom = client.channels.cache.get(WAITING_ROOM)

        //проверяем что пользователь зашел в один из каналов авто-создания
        if (
            newState.channelId == TPP_CHANNEL_ID || newState.channelId == FPP_CHANNEL_ID ||
            newState.channelId == DUO_CHANNEL_ID || newState.channelId == RANK_CHANNEL_ID ||
            newState.channelId == GAMES_CHANNEL_ID) {

            //проверяем пользователя на кулдаун
            const cooldown = Cooldown.get(newState.member.id)

            //если у пользователя есть кулдаун ...
            if (cooldown) {

                //делаем напоминание с указанием оставшегося времени
                const remaining = ((cooldown - Date.now()) / 1000).toFixed(0)

                //перемещаем пользователя в комнату ожидания
                newState.setChannel(waitingRoom)

                //пробуем отправить в ЛС пользователю сообщение с оставшимся временем кулдауна
                try {
                    await newState.member.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(`#2f3136`)
                                .setDescription(`**Пожалуйста подождите \` ${remaining} \` секунд прежде чем создать новый канал.**`)
                        ]
                    });
                } catch { }  //Отлавливаем ошибку если у пользователя закрыт ЛС

                return;
            };

            if (!newState.member.permissions.has(PermissionFlagsBits.Administrator) || !newState.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {

                //если пользователь прошел проверку на кулдаун (строчка 34) то записываем его в словарь кулдаунов
                Cooldown.set(newState.member.id, Date.now() + 1000 * 60)

                //запускаем таймер, что бы через 1 минуту кулдаун пользователя был удален
                setTimeout(() => { Cooldown.delete(newState.member.id) }, 1000 * 60 * 1);
            };

            //Авто-создание канала TPP SQUAD
            if (newState.channel?.id == TPP_CHANNEL_ID) {
                await newState.guild.channels.create({
                    name: `🥇│TPP SQUAD`,
                    type: ChannelType.GuildVoice,
                    userLimit: 4,
                    parent: TPP_CATEGORY_ID,
                    position: 0,
                }).then((channel) => { newState.setChannel(channel) });
            };

            //Авто-создание канала FPP SQUAD
            if (newState.channel?.id == FPP_CHANNEL_ID) {
                await newState.guild.channels.create({
                    name: `🥈│FPP SQUAD`,
                    type: ChannelType.GuildVoice,
                    userLimit: 4,
                    parent: FPP_CATEGORY_ID,
                    position: 0,
                }).then((channel) => { newState.setChannel(channel) });
            };

            //Авто-создание канала Duo
            if (newState.channel?.id == DUO_CHANNEL_ID) {
                await newState.guild.channels.create({
                    name: `🥈│Duo`,
                    type: ChannelType.GuildVoice,
                    userLimit: 2,
                    parent: DUO_CATEGORY_ID,
                    position: 0,
                }).then((channel) => { newState.setChannel(channel) });
            }
            //Авто-создание канала Ranked
            if (newState.channel?.id == RANK_CHANNEL_ID) {
                const data = await User.findOne({ discordId: newState.member.id });
                const tier = data?.stats?.currentTierFpp;
                const subTier = data?.stats?.currentSubTierFpp;
                const name = `🏅│${tier ? tier : 'unranked'} ` + `${subTier ? subTier : ' '}`
                await newState.guild.channels.create({
                    name: name,
                    type: ChannelType.GuildVoice,
                    userLimit: 4,
                    parent: RANK_CATEGORY_ID,
                }).then((channel) => { newState.setChannel(channel) })
            };

            //Авто-создание канала других игр
            if (newState.channel?.id == GAMES_CHANNEL_ID) {
                const userName = newState.member.user.username;
                let userPresense = newState.member.presence?.activities[0]?.name;
                if (userPresense == 'Custom Status') {
                    userPresense = userName;
                };
                await newState.guild.channels.create({
                    name: `🎲︰${userPresense || userName}`,
                    type: ChannelType.GuildVoice,
                    userLimit: 99,
                    parent: GAMES_CATEGORY_ID,
                }).then((channel) => { newState.setChannel(channel) }) //.then(channel.permissionOverwrites.edit(newState.member, { ManageChannels: true })) });
            }

            //удалять каналы мы будем в другом файле, потому что если делать это здесь прийдется прописывать это в 2-х местах...
        }
    },
};