const { Message } = require('discord.js');
const { Bump } = require('../../schemas/bump');
const { findMember } = require('../../utils/findMentionMember');

module.exports = {
    name: 'messageCreate',
    /**
     * 
     * @param {Message} message
     */

    async execute(message) {
        if (message.author.id != '315926021457051650') return;

        try {

            for (let embed of message.embeds) {

                if (embed.description.includes('[Top Discord Servers](https://myserver.gg/)\nServer bumped by')) {
                    console.log(`bump detected!`)

                    setTimeout(() => {
                        message.delete()
                    }, 10000);

                    const time = new Date().getTime();
                    const data = await Bump.findOneAndUpdate({ name: 'bump reminder' }, {
                        time: time,
                    });

                    if (!data.lastMessageId) return;
//если сообщение кто то  удалит бот крашнется, нужно обработать...
                    const { guild } = message;
                    const channel = await guild.channels.fetch(data.channelId);
                    const msg = await channel.messages.fetch(data.lastMessageId);
                    await msg.delete()

                    // let target = embed.description;
                    // const member = findMember(target)
                    // channel.send({ content: `Красавчик ${member} 👌` })

                    data.lastMessageId = null;
                    data.channelId = null;
                    data.save();
                    console.log(`Done`)


                };
            }

        } catch (err) {
            console.log(err)
        }
    }
};