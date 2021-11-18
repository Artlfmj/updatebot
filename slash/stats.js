const guild_settings = require('../schemes/guild_settings')
const Settings = require('../schemes/guild_settings')
const Discord = require('discord.js')
const ee = require('../botconfig/embed.json')
const axios = require('axios')
module.exports.run = {
	/**
	 * Generates the shop image in a design similar to the in-game design.
	 */
	async slash(client, interaction) {
      		await interaction.reply({content : "Loading stats"})
        // Stats command
        const username = interaction.options.getString("username")
        let platform;
        if(interaction.options.getString("platform")){
            platform = interaction.options.getString("platform")
        } else { platform = "epic"}
        let timeWindow;
        if(interaction.options.getString("timewindow")){
            timeWindow = interaction.options.getString("timewindow")
        } else { timeWindow = "lifetime"}
        const req = await axios({
            url : "https://fortnite-api.com/v2/stats/br/v2",
            method : "get",
            headers : {
                "x-api-key" : process.env.KEY
            },
            params : {
                name : username,
                accountType : platform,
                timeWindow : timeWindow,
                image : "all"
            }
        })
        .catch(e => {
            const em = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(e.toJSON().name)
            .setDescription("An error occured, multiple reasons are possible: \n404 : The account you provided does not exist\n403 : The account you provided hasn't set his stats to public\n400 : Please retry later")
            .setFooter(e.toJSON().message)
            return interaction.editReply({embeds : [em]})
        })
        if(req){
           
            const skins = await axios({
                method : "get",
                url : "https://fortnite-api.com/v2/cosmetics/br/search/all",
                params : {
                    "type" : "outfit"
                }
            })
           
            const embed = new Discord.MessageEmbed()
            .setAuthor(username, skins.data.data[getRandomInt(skins.data.data.length - 1)].images.icon)
            .setTitle("Additional data")
            .addField('Account ID', req.data.data.account.id)
            .addField("Acccount Name", req.data.data.account.name, true)
            .addField("Battlepass Level", req.data.data.battlePass.level.toString())
            .setImage(`${req.data.data.image}`)
            .setColor("RANDOM")
            interaction.editReply({embeds : [embed], content : "\u200b"})
            .catch(e => {
                console.log(e)
            })
        }
    }

}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
