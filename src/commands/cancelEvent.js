const { SlashCommandBuilder } = require('@discordjs/builders');
const { findChannelByName, findCategoryByName } = require('../utils/channelUtils'); // Utility functions for finding channels and categories
const { EventNotFoundError, CategoryNotFoundError } = require('../utils/errors'); // Custom error classes

module.exports = {
  name: 'cancelevent',
  description: 'Cancel an event',
  data: new SlashCommandBuilder()
    .setName('cancelevent')
    .setDescription('Cancel an event')
    .addStringOption(option => 
      option.setName('event')
        .setDescription('Enter the name of the event to cancel')
        .setRequired(true)),
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
        throw new Error('Event name must be provided!');
      }

      // Find the event channel
      const eventChannel = findChannelByName(interaction.guild, eventName);
      if (!eventChannel) {
        throw new EventNotFoundError('Event not found!');
      }

      // Find the archived events category
      const archivedEventsCategory = findCategoryByName(interaction.guild, 'archived events');
      if (!archivedEventsCategory) {
        throw new CategoryNotFoundError('Archived events category not found!');
      }

      // Move the event channel to the archived events category
      await eventChannel.setParent(archivedEventsCategory);
      await interaction.reply({ content: 'Event cancelled successfully!', ephemeral: true });

      // Find the announcement channel and update the event announcement
      const announcementChannel = findChannelByName(interaction.guild, 'future events');
      if (announcementChannel) {
        const messages = await announcementChannel.messages.fetch({ limit: 100 });
        const eventMessage = messages.find(msg => msg.embeds[0] && msg.embeds[0].title === eventName);
        if (eventMessage) {
          await eventMessage.reply('This event has been cancelled.');
        }
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: `An error occurred: ${error.message}`, ephemeral: true });
    }
  },
};