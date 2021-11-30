//here the event starts
const config = require("../../botconfig/config.json")
const Discord  = require("discord.js");
const chalk = require("chalk");
const fs = require("fs");
module.exports = async(client) => {
  client.commands = new Discord.Collection();
  let avail = []
  client.handlers = new Discord.Collection();
  client.buttons = new Discord.Collection();
  client.menus = new Discord.Collection();
  const jsondir = "slash-json";
  let cmds = await client.application.commands.fetch()
  cmds.forEach(async(slashcont) => {
    avail.push(slashcont.name)
  })
  for (const fileName of fs.readdirSync(jsondir)) {
    const fileContent = require(`../../${jsondir}/${fileName}`);
    client.commands.set(fileName.split(".")[0], fileContent);
    console.log(chalk.bold.green(`Loaded command ${fileName}`));
    if (avail.find(l => l === fileName.replace('.js', "")))
      console.log(
        chalk.bold.red(`Command ${fileContent.name} already exists!`)
      );
    else client.application.commands.create(fileContent).catch(console.error).then(da => {console.log(chalk.green.bold(`Registered ${da.name} | ${da.id}`))})
  }
  const cmdDir = "slash";
  for (const fileName of fs.readdirSync(cmdDir)) {
    const fileContent = require(`../../${cmdDir}/${fileName}`);
    client.handlers.set(fileName.split(".")[0], fileContent);
    console.log(chalk.bold.green(`Loaded handler ${fileName}`));
  }
  const butDir = "buttons";
  for (const fileName of fs.readdirSync(butDir)) {
    const fileContent = require(`../../${butDir}/${fileName}`);
    client.buttons.set(fileName.split(".")[0], fileContent);
    console.log(chalk.bold.green(`Loaded button ${fileName}`));
  }
  const menDir = "menus";
  for (const fileName of fs.readdirSync(menDir)) {
    const fileContent = require(`../../${menDir}/${fileName}`);
    client.menus.set(fileName.split(".")[0], fileContent);
    console.log(chalk.bold.green(`Loaded menu ${fileName}`));
  }
  try{
    const stringlength = 69;
    console.log("\n")
    console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightGreen)
    console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1+stringlength-` ┃ `.length)+ "┃".bold.brightGreen)
    console.log(`     ┃ `.bold.brightGreen + `Discord Bot is online!`.bold.brightGreen + " ".repeat(-1+stringlength-` ┃ `.length-`Discord Bot is online!`.length)+ "┃".bold.brightGreen)
    console.log(`     ┃ `.bold.brightGreen + ` /--/ ${client.user.tag} /--/ `.bold.brightGreen+ " ".repeat(-1+stringlength-` ┃ `.length-` /--/ ${client.user.tag} /--/ `.length)+ "┃".bold.brightGreen)
    console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1+stringlength-` ┃ `.length)+ "┃".bold.brightGreen)
    console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightGreen)
    
  }catch{ /* */ }

  try{
    client.user.setActivity(client.user.username, { type: "PLAYING" });
  }catch (e) {
      console.log(String(e.stack).red);
  }
  //Change status each 10 minutes
  setInterval(()=>{
    try{
      client.user.setActivity(client.user.username, { type: "PLAYING" });
    }catch (e) {
        console.log(String(e.stack).red);
    }
  }, 10*60*1000)
}

/** Template by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template */
