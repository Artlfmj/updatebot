const guild_settings = require("../schemes/guild_settings");
const Settings = require("../schemes/guild_settings");
const Discord = require("discord.js");
const ee = require("../botconfig/embed.json");
const axios = require("axios");

module.exports.run = async (client, interaction, translations) => {
  await interaction.reply({ content: "Loading stats" });
  const username = interaction.options.getString("username");
  let platform;
  if (interaction.options.getString("platform")) {
    platform = interaction.options.getString("platform");
  } else {
    platform = "epic";
  }
  let timeWindow;
  if (interaction.options.getString("timewindow")) {
    timeWindow = interaction.options.getString("timewindow");
  } else {
    timeWindow = "lifetime";
  }
  const req = await axios({
    url: "https://fortnite-api.com/v2/stats/br/v2",
    method: "get",
    headers: {
      "Authorization": process.env.KEY,
    },
    params: {
      name: username,
      accountType: platform,
      timeWindow: timeWindow,
      image: "all",
    },
  }).catch((e) => {
    const em = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle(e.toJSON().name)
      .setDescription(translations["048"])
      .setFooter(e.toJSON().message);
    return interaction.editReply({ embeds: [em] });
  });
  if (req) {
    const skins = await axios({
      method: "get",
      url: "https://fortnite-api.com/v2/cosmetics/br/search/all",
      params: {
        type: "outfit",
      },
    });

    const embed = new Discord.MessageEmbed()
      .setAuthor({
        name : username,
        iconURL : skins.data.data[getRandomInt(skins.data.data.length - 1)].images.icon
      })
      .setTitle(translations["050"])
      .addField(translations["051"], req.data.data.account.id)
      .addField(translations["052"], req.data.data.account.name, true)
      .addField(translations["053"], req.data.data.battlePass.level.toString())
      .setImage(`${req.data.data.image}`)
      .setColor("RANDOM");
    interaction.editReply({ embeds: [embed], content: "\u200b" }).catch((e) => {
      console.log(e);
    });
  }
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
