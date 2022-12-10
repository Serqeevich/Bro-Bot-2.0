const { WebhookClient, EmbedBuilder } = require('discord.js');
const { ERRORS_CHANNEL, ROLE_DEVELOPER } = require('../../config.json')

module.exports = (client) => {
    client.antiCrush = async () => {
        console.log(`💥 Anti crush system is work.`)

        process.on('unhandledRejection', error => {
            new WebhookClient({ url: ERRORS_CHANNEL })
                .send({
                    content: `<@&${ROLE_DEVELOPER}>`,
                    allowedMentions: { roles: [ROLE_DEVELOPER] },
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#2f3136`)
                            .setAuthor({
                                name: `${error.name}`,
                                iconURL: 'https://cdn.discordapp.com/attachments/972441100251963442/1014047787727466526/Antu_dialog-error.svg.png'
                            })
                            .setDescription(`**${error.message}**\n\n${error.stack}`)
                            .setTimestamp()
                    ],
                })

        });

        process.on('uncaughtException', error => {
            new WebhookClient({ url: ERRORS_CHANNEL })
                .send({
                    content: `<@&${ROLE_DEVELOPER}>`,
                    allowedMentions: { roles: [ROLE_DEVELOPER] },
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#2f3136`)
                            .setAuthor({
                                name: `${error.name}`,
                                iconURL: 'https://cdn.discordapp.com/attachments/972441100251963442/1014047787727466526/Antu_dialog-error.svg.png'
                            })
                            .setDescription(`**${error.message}**\n\n${error.stack}`)
                            .setTimestamp()
                    ],
                })
        });

        // process.on('uncaughtExceptionMonitor', error => {
        //     console.log(`⛔  uncaughtExceptionMonitor`, error.message) //to do
        // });

        // process.on("warning", (warn) => {
        //     console.log(`⛔  warning`) //to do
        // })

        client.on("error", (error) => {
            new WebhookClient({ url: ERRORS_CHANNEL })
                .send({
                    content: `<@&${ROLE_DEVELOPER}>`,
                    allowedMentions: { roles: [ROLE_DEVELOPER] },
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#2f3136`)
                            .setAuthor({
                                name: `${error.name}`,
                                iconURL: 'https://cdn.discordapp.com/attachments/972441100251963442/1014047787727466526/Antu_dialog-error.svg.png'
                            })
                            .setDescription(`**${error.message}**\n\n${error.stack}`)
                            .setTimestamp()
                    ],
                })

        })
    };
};