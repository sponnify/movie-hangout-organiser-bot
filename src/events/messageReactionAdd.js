const { MessageEmbed } = require('discord.js');

// Custom error classes
class EventNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "EventNotFoundError";
  }
}

class RoleNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "RoleNotFoundError";
  }
}

class MemberNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "MemberNotFoundError";
  }
}

module.exports = {
  name: 'messageReactionAdd',
  async execute(reaction, user) {
    try {
      // Fetch the reaction if it's a partial
      if (reaction.partial) {
        try {
          await reaction.fetch();
        } catch (error) {
          console.error('Fetching message reaction failed: ', error);
          return;
        }
      }

      // Ignore reactions from bots
      if (user.bot) {
        return;
      }

      // Ignore reactions in channels other than 'future events'
      if (reaction.message.channel.name !== 'future events') {
        return;
      }

      // Ignore reactions that are not a tick emoji
      if (reaction.emoji.name !== '✅') {
        return;
      }

      // Get the event name from the reaction message
      const eventName = reaction.message.embeds[0].title;

      // Find the event channel
      const eventChannel = reaction.message.guild.channels.cache.find(channel => channel.name === eventName);
      if (!eventChannel) {
        throw new EventNotFoundError('Event not found!');
      }

      // Find the event role
      const eventRole = reaction.message.guild.roles.cache.find(role => role.name === eventName);
      if (!eventRole) {
        throw new RoleNotFoundError('Event role not found!');
      }

      // Find the member who reacted
      const member = reaction.message.guild.members.cache.get(user.id);
      if (!member) {
        throw new MemberNotFoundError('Member not found!');
      }

      // Add the event role to the member
      await member.roles.add(eventRole);

      // Create the embed for the welcome message
      const embed = new MessageEmbed()
        .setTitle(eventName)
        .setDescription(`Welcome to the event, ${user.username}!`);

      // Send the welcome message in the event channel
      await eventChannel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      throw new Error(`An error occurred while handling the messageReactionAdd event: ${error.message}`);
    }
  },
};