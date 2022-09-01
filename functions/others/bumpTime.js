const { Bump } = require('../../schemas/bump');
const { CHAT_CHANNEL_ID } = require('../../config.json')

module.exports = (client) => {
    client.bump = async () => {

        console.log(`🕑 Bump timer ready!`)

        Bump.findOne({}, async (err, data) => {
            if (err) console.log(err);
            if (!data) {
                (await Bump.create({
                    name: 'bump reminder',
                    time: 0,
                    lastMessageId: null,
                    channelId: null,
                })).save();
                console.log(`🔗 Bump schema was create!`)
            };
        });

        setInterval(async () => {
            const data = await Bump.findOne({});
            if (data.time == 0) {
                return console.log(`return bump`);
            };

            const diff = new Date().getTime() - data.time;
            // 14400000 === 4 hours
            if (diff >= 14400000) {
                //const channel = client.channels.cache.find(ch => ch.id == '958794573629509662');
                const channel = client.channels.cache.get(CHAT_CHANNEL_ID);
                const message = await channel.send({ content: `_Команда \`/bump\` поднимает сервер в топ дискорд сообществ и привлекает больше новых участников на сервер - повышая вам шанс найти тиммейта, поэтому если не сложно используй ее прямо сейчас._\n\n**Заранее спасибо!**` });

                data.time = 0;
                data.lastMessageId = message.id;
                data.channelId = message.channel.id;
                data.save();
            };
        }, 1000 * 60 * 1);
    }
};