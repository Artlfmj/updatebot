const Discord = require('discord.js')
const channel = require('../schemes/channel')
const { get } = require('axios')
const ee = require('../botconfig/embed.json')
const Canvas = require('canvas')
const config = require('../botconfig/config.json')
module.exports = {
	/**
	 * Generates the shop image in a design similar to the in-game design.
	 */
	async slash(client, interaction) {
        let id;
        let name;
		const idparam = await interaction.options.getString('tab-id')
		const nameparam = await interaction.options.getString('tab-name')
		if(idparam) id = idparam
		if(nameparam) name = nameparam
		if(!idparam && !nameparam){
			return interaction.reply({content : "Veuillez fournir au moins un parametre"})
		}
		const req = await get("https://fortniteapi.io/v2/shop/sections/list", {
			headers : {
				Authorization : config.fnapiio
			},
			params : {
				sectionId : idparam,
				displayName : nameparam,
				lang : "fr"
			}
		})
		.catch(e => {
			console.log(e)
			return interaction.reply()
		})
		console.log(req.data)
    }
}