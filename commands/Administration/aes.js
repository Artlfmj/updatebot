
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const mongoose = require("mongoose");
const { get } = require("axios")
module.exports = {
    name: "aes",
    category: "",
    aliases: [""],
    cooldown: 2,
    usage: "",
    description: "",
    run: async (client, message, args, user, text, prefix) => {
        const fs = require('fs').promises;
        const { ReplayReader } = require('replay-reader');
        const reader = new ReplayReader('./replays/3.replay');
        const replay = await reader.parse();
        
        await fs.writeFile('./replay.json', JSON.stringify(replay, null, 2));
        const attach = new Discord.MessageAttachment()
        .setFile('./replay.json')
        message.channel.send(attach)
    }
}