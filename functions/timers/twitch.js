const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getAuthKey, getChannelData, getStreamsData } = require('../../API/twitch');
const { CRON, STREAMS_CHANNEL_ID, ROLE_STREAM_NOTIFY, ROLE_LIVE_STREAM, GUILD_ID } = require('../../config.json');
const CronJob = require('cron').CronJob;
const fs = require('fs');

const { Streamers } = require('../../schemas/streamers');
const { Settings } = require('../../schemas/settings');

module.exports = (client) => {

    client.twitch = async () => {

        UpdateAuthConfig()

        const check = new CronJob(CRON, async function () {

            const tempData = await Streamers.find({});
            const authKey = await Settings.findOne({ name: "twitchKey" });

            if (tempData.length == 0) return console.log(`В базе нет участников`)

            tempData.map(async function (chan) {

                const guild = await client.guilds.cache.get(GUILD_ID)
                const member = await guild.members.cache.get(chan.userId)

                if (!chan.channelName) return console.log(`Return name`);

                let StreamData = await getStreamsData(chan.channelName, process.env.twitch_clientID, authKey.value);

                if (StreamData.data.length == 0) {
                    member.roles.remove(ROLE_LIVE_STREAM)
                    chan.status = 'offline';
                    chan.save();
                    return;
                };

                if (chan.status == 'online') {
                    console.log(`message is already been send...`)
                    return;
                };

                StreamData = StreamData.data[0]

                const ChannelData = await getChannelData(chan.channelName, process.env.twitch_clientID, authKey.value);
                if (!ChannelData) return;

                const embed = new EmbedBuilder()
                    .setColor('#9146FF')
                    .setThumbnail(`${ChannelData.thumbnail_url}`)
                    .setTitle(`${StreamData.user_name} в эфире!`)
                    .setDescription(
                        `${StreamData.title}\n\n`
                        + `**Играет в ${StreamData.game_name}**`
                    )
                    .setURL(`https://www.twitch.tv/${StreamData.user_login}`)
                    .setTimestamp()
                    .setFooter({ text: `${StreamData.viewer_count} зрителей` })
                    .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${StreamData.user_login}-640x360.jpg?cacheBypass=${(Math.random()).toString()}`)

                const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel('Смотреть стрим')
                            .setEmoji('👁‍🗨')
                            .setStyle(ButtonStyle.Link)
                            .setURL(`https://www.twitch.tv/${StreamData.user_login}`),
                        new ButtonBuilder()
                            .setLabel('Поставить лайк')
                            .setEmoji('💚')
                            .setStyle(ButtonStyle.Link)
                            .setURL(`https://www.twitch.tv/${StreamData.user_login}`)

                    )

                const channel = client.channels.cache.get(STREAMS_CHANNEL_ID);


                await channel.send({
                    content: `<@&${ROLE_STREAM_NOTIFY}>`,
                    embeds: [embed],
                    components: [button],
                    allowedMentions: { roles: [ROLE_STREAM_NOTIFY] }
                });

                await member?.roles?.add(ROLE_LIVE_STREAM)
                chan.status = 'online';
                chan.save();
            });
        });

        var updateAuth = new CronJob('0 * * * *', async function () {
            UpdateAuthConfig()
        });

        async function UpdateAuthConfig() {


            //get the auth key
            const authKey = await getAuthKey(process.env.twitch_clientID, process.env.twitch_secret);
            if (!authKey) return console.log(`Не удалось обновить ayth key`);

            //write the new auth key
            Settings.findOne({}, async (err, data) => {
                if (err) console.log(err);

                if (!data) {

                    (await Settings.create({
                        name: 'twitchKey',
                        value: authKey,
                    })).save();
                    console.log(`create s KEY`)
                    return
                };
            });

            const data = await Settings.findOne({});
            data.value = authKey;
            data.save();
        };

        updateAuth.start()
        check.start();
    };
};