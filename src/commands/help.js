const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { HelpCommandError } = require('../utils/errors'); // Custom error class

module.exports = {
  name: 'help',
  description: 'Provides help information for all commands',
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Provides help information for all commands'),
  async execute(interaction) {
    try {
      // Create the embed for the help information
      const embed = new MessageEmbed()
        .setTitle('Help Information')
        .setDescription('Here are the commands you can use:')
        .addField('/createevent', 'Create a new event. You can specify the title of the movie, the theatre to watch it at, the date and time planned to watch, the actual release date in their country, a link to the trailer, and any additional information. \n\nExample: `/createevent title="Avengers: Endgame" theatre="IMAX" date="2024-05-04" time="20:00" releasedate="2024-04-26" trailer="https://www.youtube.com/watch?v=TcMBFSGVi1c" additionalinfo="Bring your own 3D glasses."`')
        .addField('/updateinfo', 'Update the information of an existing event. You can change any of the already existing information, and/or add information that was not provided. \n\nExample: `/updateinfo event="Avengers: Endgame" date="2024-05-05" time="21:00"`')
        .addField('/cancelevent', 'Cancel an existing event. You need to confirm that you want to proceed, and then the event will be moved to the "archived events" category. \n\nExample: `/cancelevent event="Avengers: Endgame"`')
        .addField('/help', 'Provides help information for all commands. Simply type `/help` to get this information.');

      // Reply to the command interaction with the help information
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: `An error occurred: ${error.message}`, ephemeral: true });
    }
  },
};