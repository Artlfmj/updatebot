const Discord = require("discord.js");
const functions = require("../schemes/channel.js");

module.exports.run = async (client, interaction, translations) => {
  if (
    interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)
  ) {
      await (client.channels.cache.get(interaction.message.channelId)).messages.edit(interaction.message.id, {embeds : [
          new Discord.MessageEmbed()
          .setColor("RANDOM")
          .setTitle(translations["043"])
          .setDescription(translations["044"])
      ], components : []})
      const fun = functions.findOne({
        function: interaction.values[0],
        guildid: interaction.guildId,
        channelid: interaction.channelId,
    });
    if (fun) {
        await functions.findByIdAndDelete(fun._id);
        return interaction.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setColor("#00ff00")
                .setTitle(translations["046"])
                .setDescription(translations["047"])
            ],
            ephemeral : true
        });
    } else {
        return interaction.reply({
            embeds: [
                new Discord.MessageEmbed()
                    .setColor("#FF0000")
                    .setDescription(translations["045"]),
            ],
        });
    }
  } else {
    interaction.reply({ content: translations["014"], ephemeral: true });
  }
};
