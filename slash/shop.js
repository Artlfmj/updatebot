const { get } = require('axios')
const Discord = require('discord.js')
const ee = require('../botconfig/embed.json')
module.exports = {
	/**
	 * Generates the shop image in a design similar to the in-game design.
	 */
	async shop(client, interaction) {
        const option = await interaction.options.getString("language")
    
        const req = await get("https://fortool.fr/cm/api/v1/shop", {
            params : {
                lang : option
            }
        })
       
        
        const embed = new Discord.MessageEmbed()
        .setColor(ee.color)
        .setImage(req.data.images.default + "?c=" + Date.now())
        interaction.reply({embeds : [embed]})
        .catch(e => {
            console.error(e)
        })
    }

}
exports = this.shop