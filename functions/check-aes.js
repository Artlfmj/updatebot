const { get } = require("axios");
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const fs = require("fs");
const config = require("../botconfig/config.json");
const clock = require("date-events")();
const ee = require("../botconfig/embed.json");
const mongoose = require("mongoose");
const aes = require("../schemes/aes");
const Channels = require("../schemes/channel");
const guild_settings = require("../schemes/guild_settings");

module.exports = async (client) => {
  clock.on("second", async () => {
    await get("https://fortnite-api.com/v2/aes", {
      params: {
        lang: "fr",
      },
    })
      .catch((err) => {
        return console.error(err);
      })
      .then(async (req) => {
        if (!req) return;
        let data = req.data.data;
        if (
          !(await aes.findOne({
            build: data.build,
            key: data.mainKey,
            updated: data.updated,
            type: "mainKey",
          }))
        ) {
          const naes = new aes({
            build: data.build,
            key: data.mainKey,
            updated: data.updated,
            type: "mainKey",
          });
          await naes.save();
          const channels = await Channels.find({ function: "aes" });
          channels.forEach(async (channel) => {
              try {
                let lang = "en";
                let sett = await guild_settings.findOne({
                    gid: channel.guildid,
                });
                if (sett) lang = sett.lang;
                const translations = await client.getTranslations(lang);
                const embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle(`${translations["001"]} | ${data.build}`)
                .setDescription(`${translations["002"]}\n*${data.mainKey}*`)
                .setFooter({iconURL : client.user.avatarURL(), text: client.user.username})
                const chan = await client.channels.cache.get(channel.channelid)
                chan.send({embeds : [embed]})
              } catch {
                console.error(`Failed to send aes`)
              }
          });
        }
        data.dynamicKeys.forEach(async (pak) => {
            if(!pak.pakFilename.includes(".pak")) return
            if (!(await aes.findOne({
                build: data.build,
                key: pak.key,
                updated: data.updated,
                type: "dynamicKey",
            }))) {
                const naes = new aes({
                    build: data.build,
                    key: pak.key,
                    updated: data.updated,
                    type: "dynamicKey",
                });
                await naes.save();
                const channels = await Channels.find({ function: "aes" });
                channels.forEach(async (channel) => {
                    try {
                        let lang = "en";
                        let sett = await guild_settings.findOne({
                            gid: channel.guildid,
                        });
                        if (sett) lang = sett.lang;
                        const translations = await client.getTranslations(lang);
                        const embed = new Discord.MessageEmbed()
                        .setColor('RANDOM')
                        .setTitle(`${translations["003"]}`)
                        .setDescription(`${translations["004"]} ${pak.pakFilename}\n*${pak.key}*`)
                        .setFooter({iconURL : client.user.avatarURL, text: client.user.username})
                        const chan = await client.channels.cache.get(channel.channelid)
                        chan.send({embeds : [embed]})
                    } catch(err) {
                        console.error(err)
                        console.error(`Failed to send aes`)
                    }
                });
            }
        })
      });
  });
};
