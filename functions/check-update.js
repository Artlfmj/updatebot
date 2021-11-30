const axios = require("axios").default;
const Discord = require("discord.js");
const fs = require("fs");
const config = require("../botconfig/config.json");
const clock = require("date-events")();
const ee = require("../botconfig/embed.json");
const Channels = require("../schemes/channel");
const update = require("../schemes/update");
const chalk = require("chalk");
let Canvas = require("canvas");
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

module.exports = async (client) => {
  clock.on("minute", async () => {
    let req = await axios
      .get("https://fortnite-api.com/v2/cosmetics/br/new")
      .catch((err) => {
        return console.error(err);
      });
    req = req.data;
    let newitems = await update.findOne({ build: req.data.build });
    if (!newitems) {
      var items,
        imageSize = 400,
        interval = 20,
        titleY = 130,
        subTitleY = titleY + 50,
        margin = 50,
        nbInlineItems = 10;
      items = req.data.items;
      await Canvas.registerFont("assets/fonts/font.otf", { family: "burbank" });
      const canvas = await Canvas.createCanvas(
        nbInlineItems * (imageSize + interval) + 2 * margin - interval,
        Math.ceil(items.length / nbInlineItems) * (imageSize + interval) +
          subTitleY +
          2 * margin -
          interval
      );
      const ctx = canvas.getContext("2d");

      with (ctx) {
        const gradient = createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#0093fb");
        gradient.addColorStop(1, "#014cbc");
        fillStyle = gradient;
        fillRect(0, 0, canvas.width, canvas.height);

        font = "70px burbank";
        fillStyle = "#75c4f1";

        fillStyle = "#fff";
        fillText(req.data.build.toUpperCase(), margin, titleY);

        font = "50px burbank";
        fillStyle = "#75c4f1";
        var x = margin,
          y = subTitleY + margin;
        for (var i = 1; i <= items.length; i++) {
          try {
            let rarity = rarities.find(
              (rr) => rr.value === items[i - 1].rarity.value
            );
            let bg = await Canvas.loadImage(`assets/rarities/${rarity.path}`);
            let bt = await Canvas.loadImage(`assets/rarities/${rarity.down}`);
            const image = await Canvas.loadImage(items[i - 1].images.icon);
            drawImage(bg, x, y, imageSize, imageSize);
            drawImage(image, x, y, imageSize, imageSize);
            drawImage(bt, x, y, imageSize, imageSize);
            font = "30px burbank";
            fillStyle = "#fff";
            fillText(
              items[i - 1].name.toUpperCase(),
              x +
                imageSize / 2 -
                measureText(items[i - 1].name.toUpperCase()).width / 2,
              y + imageSize - margin + 10
            );
          } catch (e) {
            console.log(items[i - 1].images.icon);
          }
          if (i % nbInlineItems == 0) {
            x = margin;
            y += imageSize + interval;
          } else {
            x += imageSize + interval;
          }
        }
      }

      newitems = new update({
        build: req.data.build,
        items: req.data.items,
      });
      newitems.save();
      let channels = await Channels.find({ function: "upcoming" });
      channels.forEach(async (channel) => {
      try {
        let attachment = new Discord.MessageAttachment(
          canvas.toBuffer(),
          "upcoming.png"
        );
        await client.channels.cache.get(channel.channelid).send({files : [attachment]});
      } catch (e) {
        channel.delete()
        console.log(chalk.red(`Failed to send to ${channel.channelid}`))
      }
      });
    }
  });
};
