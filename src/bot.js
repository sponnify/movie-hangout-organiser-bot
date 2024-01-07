const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

class Bot extends Discord.Client {
  constructor(options) {
    super({ intents: options.intents });
    console.log('Bot is being instantiated...');
    console.log(new Error().stack); // Log the stack trace of the instantiation
    this.commands = new Discord.Collection();
    this.loadCommands();
    this.loadEvents();
  }

  loadCommands() {
    console.log('Loading commands...');
    const commandsDirectory = path.join(__dirname, 'commands');
    fs.readdir(commandsDirectory, (err, files) => {
      if (err) console.error(err);
      files.forEach(file => {
        const filePath = path.join(commandsDirectory, file);
        console.log(`Loading command file: ${filePath}`);
        if (path.extname(file) === '.js') { // Check if the file is a JavaScript file
          const command = require(filePath);
          if (command.name && typeof command.name === 'string' && command.name.trim() !== '') {
            console.log(`Loading command: ${command.name}`);
            this.commands.set(command.name, command);
          } else {
            console.error(`Command file ${file} is missing a name property or has an invalid name and will not be loaded.`);
          }
        }
      });
    });
  }  

  loadEvents() {
    const eventsDirectory = path.join(__dirname, 'events');
    fs.readdir(eventsDirectory, (err, files) => {
      if (err) console.error(err);
      files.forEach(file => {
        const event = require(path.join(eventsDirectory, file));
        this.on(event.name, event.execute.bind(null, this));
      });
    });
  }  
}

module.exports = Bot;
