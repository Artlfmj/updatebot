const Discord = require('discord.js')
const channel = require('../schemes/channel')

module.exports.run = async (client, interaction, translations) => {
	if(!interaction.member) return interaction.reply({
		embeds : [
			new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle(translations["040"])
			.setDescription(translations["065"])
		]
	})
	if(interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
		let menu = new Discord.MessageSelectMenu()
		.setCustomId("subscribe")
		.addOptions([
			{
				label: 'AES',
				description: translations["009"],
				value: 'aes',
			},
			{
				label : 'Shop',
				description: translations["015"],
				value: 'shop',
			},
			{
				label : 'News',
				description: translations["016"],
				value: 'news',
			},
			{
				label : 'Tabs',
				description: translations["017"],
				value: 'tabs',
			},
			{
				label : 'Upcoming',
				description: translations["018"],
				value: 'upcoming',
			}
		])
		let row = new Discord.MessageActionRow()
		.addComponents(
			menu
		)
		interaction.reply({components : [row], embeds : [
			new Discord.MessageEmbed()
			.setTitle(translations["010"])
			.setDescription(translations["011"])
			.setColor(0x00AE86)
		]})
		// Attendre 3 minutes 
		setTimeout(() => {
			menu.setDisabled(true)
			let newrow = new Discord.MessageActionRow()
			.addComponents(
				menu
			)
			interaction.editReply({components : [newrow], embeds : [
				new Discord.MessageEmbed()
				.setTitle(translations["012"])
				.setDescription(translations["013"])
				.setColor(0x00AE86)
			]})
		}, 180000)
	} else {
		interaction.reply({embeds : [
			new Discord.MessageEmbed()
			.setTitle(translations["014"])
			.setColor(0xFF0000)
		]})
	}
}