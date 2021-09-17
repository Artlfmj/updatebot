const Discord = require('discord.js')
const channel = require('../schemes/channel')
module.exports = {
	/**
	 * Generates the shop image in a design similar to the in-game design.
	 */
	async slash(client, interaction) {
		const functionparam = await interaction.options.getString("function")
		
		if(interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)){
			const functioninfo = await channel.findOne({function : functionparam, channelid : interaction.channel.id, guildid : interaction.guild.id})
            if(!functioninfo){
                return interaction.reply({content : "La fonction que vous avez precisée n'était pas enregistrée pour ce salon", ephemeral : true})
            }
			functioninfo.delete()
			interaction.reply({content : `Fonction ${functionparam} bien supprimé!`})
		} else {
			interaction.reply({content : "Vous n'avez pas les permissions necessaires pour effectuer cette action!", ephemeral : true})
		}
    }

}