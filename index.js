require('dotenv').config();
const Bot = require('./src/bot');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const Discord = require('discord.js');
const { GatewayIntentBits } = require('discord.js');

const bot = new Bot({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

// Load commands and events
bot.loadCommands(path.join(__dirname, 'src', 'commands'));
bot.loadEvents(path.join(__dirname, 'src', 'events'));

bot.login(process.env.BOT_TOKEN).then(() => {
  console.log('Bot has logged in.');

  // Command registration code
  const commands = Array.from(bot.commands.values()).filter(command => {
    // Log the command name and description to the console
    console.log(`Command name: ${command.name}, description: ${command.description}`);
    if (!command.name || typeof command.name !== 'string' || command.name.trim() === '') {
      console.error(`Command with description "${command.description}" is missing a name or has an invalid name.`);
      return false;
    }
    // Check if the command has a description
    if (!command.description || typeof command.description !== 'string' || command.description.trim() === '') {
      console.error(`Command with name "${command.name}" is missing a description or has an invalid description.`);
      return false;
    }
    return true;
  }).map(command => {
    return {
      name: command.name,
      description: command.description,
    };
  });

  const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

  (async () => {
    try {
      console.log('Started refreshing application (/) commands.');

      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands },
      );

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  })();
});

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});