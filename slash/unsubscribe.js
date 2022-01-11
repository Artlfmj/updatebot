const Discord = require('discord.js')
const channel = require('../schemes/channel')

module.exports.run = async (client, interaction, translations) => {
	if(interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
		const channels = await channel.find({
		guildid: interaction.guildId
		});
		if(!channels.length) return interaction.reply({ embeds : [
			new Discord.MessageEmbed()
			.setTitle(translations["034"])
			.setDescription(translations["035"])
			.setColor("RANDOM")
		]})
		const row = new Discord.MessageActionRow()
		.addComponents([
			new Discord.MessageSelectMenu()
			.setCustomId("unsubscribe")
			.setOptions(channels.map(c => {
				return {
					label: c.function.toUpperCase(),
					description: translations["036"],
					value: c.function,
				}
			}))
		])
		interaction.reply({ components : [row], embeds : [
			new Discord.MessageEmbed()
			.setTitle(translations["037"])
			.setDescription(translations["038"])
			.setColor("RANDOM")
		]})
  	} else {
		interaction.reply({
		embeds: [
			new Discord.MessageEmbed()
			.setTitle(translations["014"])
			.setColor(0xff0000),
		],
		});
}
};
