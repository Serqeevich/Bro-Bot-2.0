const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();
client.commandArray = [];
client.buttons = new Collection();
client.modals = new Collection();
client.selectMenus = new Collection();
client.lfc = new Collection();



const functionFolders = fs.readdirSync('./functions');
for (const folder of functionFolders) {
    const functionFiles = fs
        .readdirSync(`./functions/${folder}`)
        .filter((file) => file.endsWith(".js"));
    for (const file of functionFiles) {
        require(`./functions/${folder}/${file}`)(client);
    }
};

// const { Player } = require('discord-player');
// client.player = new Player(client, {
//     ytdlOptions: {
//         quality: "highestaudio",
//         highWaterMark: 1 << 25,
//     }
// });


client.antiCrush();
client.handleCommands();
client.handleEvents();
client.handleComponents();
client.connect();
client.bump();
client.twitch();
client.roomsActivity();


client.login(process.env.token);