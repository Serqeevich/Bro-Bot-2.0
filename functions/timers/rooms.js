const { EmbedBuilder, WebhookClient } = require('discord.js')
const { GUILD_ID, BAN_KICK_MUTE_CHANNEL } = require('../../config.json');

const CronJob = require('cron').CronJob;
const { Rooms } = require('../../schemas/private-room');

module.exports = async (client) => {
    client.roomsActivity = async () => {

        const timer = new CronJob('*/1 * * * *', async function () {

            const rooms = await Rooms.find({});

            rooms.map(async (room) => {

                const diff = Date.now() - room.lastActivity;

                if (diff > 259200000) {   //3 days

                    const guild = client.guilds.cache.get(GUILD_ID);
                    const member = guild.members.cache.get(room.userId);
                    const channel = guild.channels.cache.get(room.channelId);

                    try {
                        await member.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(`#2f3136`)
                                    .setDescription(
                                        `**Ваш канал \` ${room.channelName} \` удален из-за неактивности**\n`
                                        + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                                    )]
                        })
                    } catch { };

                    new WebhookClient({ url: BAN_KICK_MUTE_CHANNEL })
                        .send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(`#2f3136`)
                                    .setDescription(
                                        `**Канал \` ${room.channelName} \` участника ${member.user.username} удален из-за неактивности**\n`
                                        + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                                    )
                                    .setTimestamp()
                                    .setFooter({ text: `🔴` })
                            ]
                        })

                    await channel.delete();
                    await room.delete();

                } else { return console.log(`not today`) }
            })
        });

        timer.start();
    };
};