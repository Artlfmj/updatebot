const Discord = require("discord.js");
const axios = require("axios").default;

module.exports.run = async (client, interaction, translations) => {
  let aes = await axios.get("https://fortnite-api.com/v2/aes").catch((err) => {
    return interaction.reply({
      embeds: [
        new Discord.MessageEmbed()
          .setColor("RANDOM")
          .setTitle(translations["040"])
          .setDescription(translations["041"]),
      ],
    });
  });
  if (aes) {
    let keys = []
    aes.data.data.dynamicKeys.forEach(key => {if(key.pakFilename.includes(".pak")) {keys.push(key)}})
    let fields = keys.map((key) => {
      return {
        name: key.pakFilename,
        value: key.key,
        inline: false,
      };
    });
    return interaction.reply({
      embeds: [
        new Discord.MessageEmbed()
          .setColor("#ff0000")
          .setTitle(
            translations["039"].replace("{{version}}", aes.data.data.build)
          )
          .addFields(fields),
      ],
    });
  }
};
