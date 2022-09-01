const { Client, ActivityType } = require('discord.js');
const { GUILD_ID } = require('../../config.json');
const { setupRoles } = require('../../utils/roles');

module.exports = {
    name: 'ready',
    once: true,
    /**
     * 
     * @param {Client} client 
     */
    async execute(client) {

        const guild = await client.guilds.fetch(GUILD_ID);
        await setupRoles(guild)

        client.user.setActivity(`/help`, { type: ActivityType.Watching })

        console.log(`${client.user.username} is online!`);

    },
};
