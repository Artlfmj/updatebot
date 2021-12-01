const Discord = require("discord.js");
const functions = require("../schemes/channel.js");

module.exports.run = async (client, interaction, translations) => {
  if (
    interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)
  ) {
    if (
      await functions.findOne({
        function: interaction.values[0],
        guildid: interaction.guildId,
        channelid: interaction.channelId,
      })
    ) {
      return interaction.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setColor("#FF0000")
            .setDescription(translations["021"]),
        ],
      });
    }
    let f = new functions({
      function: interaction.values[0],
      guildid: interaction.guildId,
      channelid: interaction.channelId,
    });
    f.save().then(() => {
      interaction.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setTitle(translations["019"])
            .setDescription(translations["020"])
            .setColor("#00ff00"),
        ],
      });
    });
  } else {
    interaction.reply({ content: tanslations["014"], ephemeral: true });
  }
};
