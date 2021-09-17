const Discord = require('discord.js')
const channel = require('../schemes/channel')
const { get } = require('axios')
const ee = require('../botconfig/embed.json')
module.exports = {
	/**
	 * Generates the shop image in a design similar to the in-game design.
	 */
	async slash(client, interaction) {
        const aes = await get("https://fortnite-api.com/v2/aes")
        const embed = new Discord.MessageEmbed()
        .setTitle(`Current AES keys for ${aes.data.data.build}`)
        .setColor(ee.color)
        .addField('Main Key', aes.data.data.mainKey)
        .addField('Dynamic Keys', '\u200b')
        
        aes.data.data.dynamicKeys.forEach(key => {
            embed.addField(key.pakFilename, key.key)
        })
       
        interaction.reply({embeds : [embed]})
    }
}