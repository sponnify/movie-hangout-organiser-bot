const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const moment = require('moment'); // You'll need to install this package
const { InputError, EventNotFoundError } = require('../utils/errors'); // Custom error classes
const { findChannelByName } = require('../utils/channelUtils'); // Utility function for finding channels
const { validateEventInputs } = require('../utils/validation'); // Validation function for event inputs

module.exports = {
  name: 'updateinfo',
  description: 'Update the information of an existing event',
  data: new SlashCommandBuilder()
    .setName('updateinfo')
    .setDescription('Update the information of an existing event')
    .addStringOption(option => 
      option.setName('event')
        .setDescription('Enter the name of the event to update')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('title')
        .setDescription('Enter the new title of the movie')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('theatre')
        .setDescription('Enter the new theatre to watch it at')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('date')
        .setDescription('Enter the new date planned to watch')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('time')
        .setDescription('Enter the new time planned')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('releasedate')
        .setDescription('Enter the new actual release date in their country')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('trailer')
        .setDescription('Enter a new link to the trailer')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('additionalinfo')
        .setDescription('Enter any new additional information')
        .setRequired(false)),
  async execute(interaction) {
    try {
      // Check if the user has the "planner" role
      const member = interaction.guild.members.cache.get(interaction.user.id);
      if (!member.roles.cache.some(role => role.name === 'planner')) {
        throw new Error('You do not have permission to use this command!');
      }

      // Get the event name from the command options
      const eventName = interaction.options.getString('event');
      if (!eventName || eventName.length === 0) {
        throw new InputError('Event name must be provided!');
      }

      // Find the event channel
      const eventChannel = findChannelByName(interaction.guild, eventName);
      if (!eventChannel) {
        throw new EventNotFoundError('Event not found!');
      }

      // Get the new event details from the command options
      const newEventDetails = {
        title: interaction.options.getString('title'),
        theatre: interaction.options.getString('theatre'),
        date: interaction.options.getString('date'),
        time: interaction.options.getString('time'),
        releaseDate: interaction.options.getString('releasedate'),
        trailer: interaction.options.getString('trailer'),
        additionalInfo: interaction.options.getString('additionalinfo'),
      };

      // Validate the new event details
      validateEventInputs(newEventDetails);

      // Create the embed for the new event details
      const embed = new MessageEmbed()
        .setTitle(newEventDetails.title ? newEventDetails.title : eventChannel.name)
        .addField('Theatre', newEventDetails.theatre ? newEventDetails.theatre : 'Not provided', true)
        .addField('Date', newEventDetails.date ? newEventDetails.date : 'Not provided', true)
        .addField('Time', newEventDetails.time ? newEventDetails.time : 'Not provided', true)
        .addField('Release Date', newEventDetails.releaseDate ? newEventDetails.releaseDate : 'Not provided', true)
        .addField('Trailer', newEventDetails.trailer ? newEventDetails.trailer : 'Not provided', true)
        .addField('Additional Info', newEventDetails.additionalInfo ? newEventDetails.additionalInfo : 'Not provided', true);

      // Find the event message and edit it with the new details
      const messages = await eventChannel.messages.fetch({ limit: 100 });
      const eventMessage = messages.find(msg => msg.embeds[0] && msg.embeds[0].title === eventChannel.name);
      if (eventMessage) {
        await eventMessage.edit({ embeds: [embed] });
      }

      // Find the announcement message and edit it with the new details
      const announcementChannel = findChannelByName(interaction.guild, 'future events');
      if (announcementChannel) {
        const messages = await announcementChannel.messages.fetch({ limit: 100 });
        const announcementMessage = messages.find(msg => msg.embeds[0] && msg.embeds[0].title === eventChannel.name);
        if (announcementMessage) {
          await announcementMessage.edit({ embeds: [embed] });
          await announcementMessage.reply('Crucial information has been added to this event. Check the original message for details.');
        }
      }

      // Reply to the command interaction
      await interaction.reply({ content: 'Event updated successfully!', ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: `An error occurred: ${error.message}`, ephemeral: true });
    }
  },
};