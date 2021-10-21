/**
  * @INFO
  * Loading all needed File Information Parameters
*/
const config = require("../../botconfig/config.json"); //loading config file with token and prefix, and settings
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!

//here the event starts
module.exports = async (client, interaction) => {
   console.log(interaction)
    if(interaction.commandId === "859467435437850625"){
        
        const { prefix } = require('../..//slash/prefix')
        await prefix(client, interaction)
    } else if(interaction.commandId === "860477440953810985"){
        const news = require('../../slash/news')
        await news.news(client, interaction)
    } else if(interaction.commandId === "860477439212912671"){
        const { shop } = require('../../slash/shop')
        await shop(client, interaction)
    } else if(interaction.commandId === "871781969795641375"){
        const { addFunction } = require('../../slash/add-function')
        await addFunction(client, interaction)
    } else if(interaction.commandId === "878565228982468649"){
        const slash = require('../../slash/unsuscribe')
        await slash.slash(client, interaction)
    } else if(interaction.commandId === "879386064777805885"){
        const slash = require('../../slash/aes')
        await slash.slash(client, interaction)
    } else if(interaction.commandId === "880805856281763920"){
        const slash = require('../../slash/upcoming')
        await slash.slash(client, interaction)
    } else if(interaction.commandId === "880853624459239505"){
        const slash = require('../../slash/tab')
        await slash.slash(client, interaction)
    }else {
        return interaction.reply({content : "An error occured", ephemeral : true})
    }
}