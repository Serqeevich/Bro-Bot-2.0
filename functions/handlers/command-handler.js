const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fs = require('fs');

const { CLIENT_ID, GUILD_ID } = require('../../config.json')

module.exports = async (client) => {
    client.handleCommands = async () => {
        const commandFolders = fs.readdirSync('./Commands');
        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./Commands/${folder}`)
                .filter((file) => file.endsWith(".js"));

            const { commands, commandArray } = client;
            for (const file of commandFiles) {
                const command = require(`../../Commands/${folder}/${file}`);
                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());
            }
        }

        const rest = new REST({ version: '10' }).setToken(process.env.token);
        try {
            console.log(`Starterd refreshing application (/) commands...`);

            await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
                body: client.commandArray,
            })
            //console.log(`🔗 Done refreshing application (/) commands.`)
        } catch (error) {
            console.log(error)
        }
    };
};