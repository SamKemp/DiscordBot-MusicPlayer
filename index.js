require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require("ytdl-core");

// Command prefix
var prefix = '¬';


client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
})
client.once('reconnecting', () => {
    console.log('Reconnecting!');
});
client.once('disconnect', () => {
    console.log('Disconnect!');
});

client.on("message", msg => {

    // Ignore DM's
    if(!msg.guild) return;

    // Ignore self
    if(msg.author.id == client.user.id) return;


})

client.login(process.env.BOT_TOKEN);