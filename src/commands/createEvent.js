const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const moment = require('moment'); // You'll need to install this package
const { InputError, CategoryNotFoundError, ChannelCreationError, AnnouncementError } = require('../utils/errors'); // Custom error classes
const { findCategoryByName } = require('../utils/channelUtils'); // Utility function for finding categories
const { validateEventInputs } = require('../utils/validation'); // Validation function for event inputs

module.exports = {
  name: 'createevent',
  description: 'Create a new event',
  data: new SlashCommandBuilder()
    .setName('createevent')
    .setDescription('Create a new event')
    .addStringOption(option => 
      option.setName('title')
        .setDescription('Enter the title of the movie')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('theatre')
        .setDescription('Enter the theatre to watch it at')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('date')
        .setDescription('Enter the date planned to watch')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('time')
        .setDescription('Enter the time planned')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('releasedate')
        .setDescription('Enter the actual release date in their country')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('trailer')
        .setDescription('Enter a link to the trailer')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('additionalinfo')
        .setDescription('Enter any additional information')
        .setRequired(false)),
  async execute(interaction) {
    try {
      // Check if the user has the "planner" role
      const member = interaction.guild.members.cache.get(interaction.user.id);
      if (!member.roles.cache.some(role => role.name === 'planner')) {
        throw new Error('You do not have permission to use this command!');
      }

      // Get the event details from the command options
      const eventDetails = {
        title: interaction.options.getString('title'),
        theatre: interaction.options.getString('theatre'),
        date: interaction.options.getString('date'),
        time: interaction.options.getString('time'),
        releaseDate: interaction.options.getString('releasedate'),
        trailer: interaction.options.getString('trailer'),
        additionalInfo: interaction.options.getString('additionalinfo'),
      };

      // Validate the event details
      validateEventInputs(eventDetails);

      // Create the embed for the event details
      const embed = new MessageEmbed()
        .setTitle(eventDetails.title)
        .addField('Theatre', eventDetails.theatre ? eventDetails.theatre : 'Not provided', true)
        .addField('Date', eventDetails.date ? eventDetails.date : 'Not provided', true)
        .addField('Time', eventDetails.time ? eventDetails.time : 'Not provided', true)
        .addField('Release Date', eventDetails.releaseDate ? eventDetails.releaseDate : 'Not provided', true)
        .addField('Trailer', eventDetails.trailer ? eventDetails.trailer : 'Not provided', true)
        .addField('Additional Info', eventDetails.additionalInfo ? eventDetails.additionalInfo : 'Not provided', true);

      // Find the future events category
      const futureEventsCategory = findCategoryByName(interaction.guild, 'future events');
      if (!futureEventsCategory) {
        throw new CategoryNotFoundError('Future events category not found!');
      }

      // Create a new role for the event
      const eventRole = await interaction.guild.roles.create({
        name: eventDetails.title,
        mentionable: true,
      });

      // Create a new channel for the event
      const eventChannel = await interaction.guild.channels.create(`FUTURE ${eventDetails.title} event`, {
        type: 'GUILD_TEXT',
        parent: futureEventsCategory,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
          },
          {
            id: eventRole.id,
            allow: ['VIEW_CHANNEL'],
          },
        ],
      });

      if (!eventChannel) {
        throw new ChannelCreationError('Failed to create event channel!');
      }

      // Send the event details in the new channel
      await eventChannel.send({ embeds: [embed] });

      // Find the announcement channel and send an announcement for the new event
      const announcementChannel = findChannelByName(interaction.guild, 'future events');
      if (announcementChannel) {
        const announcementEmbed = new MessageEmbed()
          .setTitle(`New event created: ${eventDetails.title}`)
          .setDescription(`React with ✅ to join the event!`)
          .addField('Theatre', eventDetails.theatre ? eventDetails.theatre : 'Not provided', true)
          .addField('Date', eventDetails.date ? eventDetails.date : 'Not provided', true)
          .addField('Time', eventDetails.time ? eventDetails.time : 'Not provided', true)
          .addField('Release Date', eventDetails.releaseDate ? eventDetails.releaseDate : 'Not provided', true)
          .addField('Trailer', eventDetails.trailer ? eventDetails.trailer : 'Not provided', true)
          .addField('Additional Info', eventDetails.additionalInfo ? eventDetails.additionalInfo : 'Not provided', true);

        const announcementMessage = await announcementChannel.send({ embeds: [announcementEmbed] });
        if (!announcementMessage) {
          throw new AnnouncementError('Failed to send announcement message!');
        }

        // React to the announcement with a tick emoji
        await announcementMessage.react('✅');
      }

      // Reply to the command interaction
      await interaction.reply({ content: 'Event created successfully!', ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: `An error occurred: ${error.message}`, ephemeral: true });
    }
  },
};