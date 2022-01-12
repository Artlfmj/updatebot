const { get } = require("axios");
const Discord = require("discord.js");
const ee = require("../botconfig/embed.json");
const guild_settings = require("../schemes/guild_settings");
module.exports.run = async (client, interaction, translations) => {
  let lang = "en";
  let sett = await guild_settings.findOne({
    gid: interaction.guildId,
  });
  if (sett) lang = sett.lang;
  const option = await interaction.options.getString("language");

  const req = await get("https://fortool.fr/cm/api/v1/shop", {
    params: {
      lang,
    },
  });

  const embed = new Discord.MessageEmbed()
    .setColor(ee.color)
    .setImage(req.data.images.default + "?c=" + Date.now());
  interaction.reply({ embeds: [embed] }).catch((e) => {
    console.error(e);
  });
};
