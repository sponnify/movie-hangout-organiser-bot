const { MessageEmbed } = require('discord.js');

function createEventEmbed(event) {
  const embed = new MessageEmbed()
    .setTitle(event.name)
    .setDescription(event.description)
    .addField('Date', event.date)
    .addField('Time', event.time);
  return embed;
}

module.exports = { createEventEmbed };