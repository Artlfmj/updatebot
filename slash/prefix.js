const guild_settings = require('../schemes/guild_settings')
const Settings = require('../schemes/guild_settings')
const Discord = require('discord.js')
const ee = require('../botconfig/embed.json')
module.exports = {
	/**
	 * Generates the shop image in a design similar to the in-game design.
	 */
	async prefix(client, interaction) {
        
       
        const param = await Settings.findOne({gid : interaction.member.guild.id})
        if(param){
            const embed = new Discord.MessageEmbed()
            .setColor(ee.color)
            .setTitle(`Prefixe du serveur`)
            .setDescription(`Voici le prefixe defini sur ce serveur\n\n**${param.prefix}**\n\n*Si vous désirez le changer utilisez la fonctionnalité setprefix*`)
            interaction.reply({embeds : [embed]})
        } else {
            const nparam = new Settings({
                gid : interaction.member.guild.id,
                prefix : "!"
            })
            nparam.save()
            interaction.reply({content : "Ce serveur n'était pas enregistré dans la base de données, nous avons crée les données pour vous! Veuillez réeffectuer la commande pour afficher le prefix", ephemeral : true})
        }
    }

}