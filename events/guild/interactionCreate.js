/**
 * @INFO
 * Loading all needed File Information Parameters
 */
const config = require("../../botconfig/config.json"); //loading config file with token and prefix, and settings
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const chalk = require("chalk"); //this is a library to add colors to text in the console

//here the event starts
module.exports = async (client, interaction) => {
  console.log(chalk.blue("[EVENT]") + " " + chalk.yellow("interactionCreate"));
  let translations = await client.getTranslations(interaction.guildId)
  if (interaction.isCommand()) {
    const cmd = await client.handlers.get(interaction.commandName);
    if (cmd) {
      await cmd.run(client, interaction, translations);
      console.log(
        chalk.gray(
          `Executed command ${interaction.commandName} | ${interaction.guildId} | ${interaction.user.id}`
        )
      );
    } else {
      interaction.reply({ content: "Command not found!" });
    }
  }
  else if(interaction.isButton()) {
    const cmd = await client.buttons.get(interaction.customId);
    if (cmd) {
      await cmd.run(client, interaction, translations);
      console.log(chalk.gray(`Executed button ${interaction.customId} | ${interaction.guildId || 'DM'} | ${interaction.user.id}`));
    } else {
      interaction.reply({ content: "Button not found!" });
    }
  }
  else if(interaction.isSelectMenu()) {
    
    const cmd = await client.menus.get(interaction.customId);
    if (cmd) {
      await cmd.run(client, interaction, translations);
      console.log(chalk.gray(`Executed menu ${interaction.customId} | ${interaction.guildId || 'DM'} | ${interaction.user.id}`));
    } else {
      interaction.reply({ content: "Select Menu not found!" });
    }
  }
  else interaction.reply({ content: "An error occured", ephemeral: true });
};
