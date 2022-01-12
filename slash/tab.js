const Discord = require("discord.js");
const channel = require("../schemes/channel");
const { get, default: axios } = require("axios");
const ee = require("../botconfig/embed.json");
const Canvas = require("canvas");
const config = require("../botconfig/config.json");
const fs = require("fs");
const errors = fs.createWriteStream("assets/errors.log", {
  flags: "a",
});

let rarities = [
  {
    value: "icon",
    path: "Icon.png",
    down: "IconDown.png",
  },
  {
    value: "common",
    path: "Common.png",
    down: "CommonDown.png",
  },
  {
    value: "uncommon",
    path: "Uncommon.png",
    down: "UncommonDown.png",
  },
  {
    value: "rare",
    path: "Rare.png",
    down: "RareDown.png",
  },
  {
    value: "epic",
    path: "Epic.png",
    down: "EpicDown.png",
  },
  {
    value: "legendary",
    path: "Legendary.png",
    down: "LegendaryDown.png",
  },
  {
    value: "mythic",
    path: "Mythic.png",
    down: "MythicDown.png",
  },
  {
    value: "slurp",
    path: "Slurp.png",
    down: "SlurpDown.png",
  },
  {
    value: "starwars",
    path: "Starwars.png",
    down: "StarwarsDown.png",
  },
  {
    value: "dark",
    path: "Dark.png",
    down: "DarkDown.png",
  },
  {
    value: "dc",
    path: "DC.png",
    down: "DCDown.png",
  },
  {
    value: "frozen",
    path: "Frozen.png",
    down: "FrozenDown.png",
  },
  {
    value: "lava",
    path: "Lava.png",
    down: "LavaDown.png",
  },
  {
    value: "marvel",
    path: "Marvel.png",
    down: "MarvelDown.png",
  },
  {
    value: "shadow",
    path: "Shadow.png",
    down: "ShadowDown.png",
  },
  {
    value: "transcendent",
    path: "Transcendent.png",
    down: "TranscendentDown.png",
  },
  {
    value: "unattainable",
    path: "Unattainable.png",
    down: "UnattainableDown.png",
  },
];

module.exports.run = async (client, interaction, translations) => {
  let id;
  let name;
  const idparam = await interaction.options.getString("id");
  const nameparam = await interaction.options.getString("name");
  if (idparam) id = idparam;
  if (nameparam) name = nameparam;
  if (!idparam && !nameparam) {
    return interaction.reply({
      content: translations["054"],
    });
  }
  const req = await axios.get(
    "https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game/shop-sections"
  );
  if (id) {
    let res = await req.data.sectionList.sections.find(
      (sec) => sec.sectionId === id
    );
    if (!res)
      return interaction.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setTitle(translations["056"])
            .setDescription(
              translations["055"].replace("{{param}}", `ID : ${id}`)
            )
            .setColor("RED"),
        ],
      });
    let embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`Showing tab info for ${res.sectionId}`)
      .setDescription(
        `**${translations["049"]}** : ${humanizeBoolean(
          res.bSortOffersByOwnership,
          translations
        )}`
      );
    return interaction.reply({ embeds: [embed] });
  } else {
    let res = await req.data.sectionList.sections.find(
      (sec) => sec.sectionDisplayName === name
    );
    if (!res)
      return interaction.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setTitle(translations["056"])
            .setDescription(
              translations["055"].replace("{{param}}", `displayName : ${name}`)
            )
            .setColor("RED"),
        ],
      });
    let embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`${translations["060"]}${res.sectionId}`)
      .setDescription(
        `**${translations["049"]}** : ${humanizeBoolean(
          res.bSortOffersByOwnership,
          translations
        )}\n**${translations["059"]}** : ${res.landingPriority}\n**${
          translations["061"]
        }:** ${humanizeBoolean(res.bShowTimer, translations)}\n**${
          translations["062"]
        }:** ${humanizeBoolean(res.bShowIneligibleOffers, translations)}\n${
          translations["063"]
        }`
      );
    await interaction.reply({ embeds: [embed] });
    let search = [];
    let searchn = await axios
      .get("https://fortnite-api.com/v2/cosmetics/br/search/all", {
        params: {
          name: res.sectionDisplayName,
        },
      })
      .catch((e) => {
        errors.write("Error on search");
      });
    if (searchn) {
      searchn.data.data.forEach((element) => {
        search.push(element);
      });
    }
    let searchs = await axios
      .get("https://fortnite-api.com/v2/cosmetics/br/search/all", {
        params: {
          set: res.sectionDisplayName,
        },
      })
      .catch((e) => {
        errors.write(`Error on search`);
      });
    if (searchs) {
      searchs.data.data.forEach((element) => {
        search.push(element);
      });
    }

    if (search.length) {
      let cosmetics = search;
      cosmetics.push({
        watermark: true,
      });
      let nmbr = Math.sqrt(cosmetics.length);
      nmbr = Math.ceil(nmbr);
      const canvas = Canvas.createCanvas(
        nmbr * 512,
        Math.round(cosmetics.length / nmbr) * 512
      );
	  await Canvas.registerFont("./assets/fonts/BurbankBigRegularBlack.otf", {
		family: "Burbank Big Regular",
		style: "Black",
	  });
      const ctx = canvas.getContext("2d");
      const background = await Canvas.loadImage("./assets/background.png");
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      for (let i = 0; i < nmbr; i++) {
        await drawRow(
          canvas,
          cosmetics.slice(i * nmbr, (i + 1) * nmbr),
          ctx,
          i,
          client
        );
        ctx.translate(-512 * nmbr, 512);
      }
      let attach = new Discord.MessageAttachment()
        .setFile(canvas.toBuffer())
        .setName("search.png");
      embed.setImage("attachment://search.png");
      embed.setDescription(
        embed.description.replace(
          translations["063"],
          `${cosmetics.length}${translations["064"]}`
        )
      );
      await interaction.editReply({ embeds: [embed], files: [attach] });
    }
  }
};

function humanizeBoolean(variable, translations) {
  if (variable) return translations["057"];
  else return translations["058"];
}

async function drawRow(canvas, cosmetics, ctx, row, client) {
  for (let i = 0; i < cosmetics.length; i++) {
    await drawCosmetic(cosmetics[i], ctx, client);
    ctx.translate(512, 0);
  }
}

async function drawCosmetic(cosmetic, ctx, client) {
  if (cosmetic.watermark) {
    const watermark = await Canvas.loadImage(
      client.user.displayAvatarURL({ format: "png", size: 512 })
    );
    ctx.drawImage(watermark, 0, 0, 512, 512);
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "30px burbank";
    ctx.fillText(`${client.user.username}`, 0, 512);
  } else {
    const rarity = rarities.find(
      (rarity) => rarity.value === cosmetic.rarity.value
    );
    const image = await Canvas.loadImage(cosmetic.images.icon);
    ctx.drawImage(image, 0, 0, 512, 512);
    if (rarity) {
      const front = await Canvas.loadImage(`assets/rarities/${rarity.down}`);
      ctx.drawImage(front, 0, 0, 512, 512);
    }
    ctx.fillStyle = "white";
    ctx.font = "30px burbank";
    ctx.fillText(`${cosmetic.name}`, 0, 512);
  }
}
