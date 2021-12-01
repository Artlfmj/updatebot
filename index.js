//Importing all needed Commands
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const colors = require("colors"); //this Package is used, to change the colors of our Console! (optional and doesnt effect performance)
const fs = require("fs"); //this package is for reading files and getting their inputs
require("dotenv").config();
const chalk = require("chalk");
let params = require("./schemes/guild_settings");

//Creating the Discord.js Client for This Bot with some default settings ;) and with partials, so you can fetch OLD messages
const client = new Discord.Client({
  messageCacheLifetime: 60,
  fetchAllMembers: false,
  messageCacheMaxSize: 10,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  disableEveryone: true,
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: [
    "GUILD_MESSAGES",
    "GUILDS",
    "DIRECT_MESSAGE_REACTIONS",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_INTEGRATIONS",
    "GUILD_BANS",
    "GUILD_INVITES",
    "GUILD_MESSAGE_TYPING",
    "GUILD_VOICE_STATES",
    "DIRECT_MESSAGE_TYPING",
  ],
});

//Client variables to use everywhere
client.commands = new Discord.Collection(); //an collection (like a digital map(database)) for all your commands
client.aliases = new Discord.Collection(); //an collection for all your command-aliases
client.cooldowns = new Discord.Collection(); //an collection for cooldown commands of each user
client.slash = new Discord.Collection();

client.getTranslations = async(guildId) => {
  let lang = "en";
  let sett = await params.findOne({
    gid: guildId,
  });
  if (sett) lang = sett.lang;
  if(!sett) {
    let newSett = new params({
      gid: guildId,
      lang: "en",
    });
    await newSett.save();
  }
  return require(`./translations/${lang}.json`);
};

[
  //Loading files, with the client variable like Command Handler, Event Handler, ...
  ("command", "events"),
].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

const featuresDir = "functions";
for (const fileName of fs.readdirSync(featuresDir)) {
  const fileContent = require(`./${featuresDir}/${fileName}`);
  client.on(fileName.split(".")[0], fileContent.bind(null, client));
  client.emit(fileName.split(".")[0]);
}

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;
mongoose.Promise = global.Promise;
//login into the bot
client.login(require("./botconfig/config.json").token);
