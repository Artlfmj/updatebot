const Discord = require('discord.js')
const channel = require('../schemes/channel')
module.exports = {
	/**
	 * Generates the shop image in a design similar to the in-game design.
	 */
	async addFunction(client, interaction) {
		const functionparam = await interaction.options.getString("function")
		console.log(functionparam)
		if(interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)){
			const newfunction = new channel({
				function : functionparam,
				guildid : interaction.guildId,
				channelid : interaction.channelId
			})
			newfunction.save()
			interaction.reply({content : "Salon bien sauvegardé"})
		} else {
			interaction.reply({content : "Vous n'avez pas les permissions necessaires pour effectuer cette action!", ephemeral : true})
		}
    }

}