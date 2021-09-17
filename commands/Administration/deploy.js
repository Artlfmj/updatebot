
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const Channels = require("../../schemes/channel")

module.exports = {
    name: "deploy",
    category: "",
    aliases: [""],
    cooldown: 2,
    usage: "",
    description: "",
    run: async (client, message, args, user, text, prefix) => {
        const command = {
            name : "tab",
            description : "Get a shop tab data",
            options : [
                {
                    name : "tab-id",
                    description : "The id of the tab",
                    type : "STRING"
                },
                {
                    name : "tab-name",
                    description : "The name of the tab",
                    type : "STRING"
                }
            ]
        }

       
        
    }
}