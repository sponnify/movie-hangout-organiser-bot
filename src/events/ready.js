const { Collection } = require('discord.js');
const moment = require('moment'); // You'll need to install this package
const schedule = require('node-schedule'); // You'll need to install this package

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    // Time intervals for warnings in minutes
    const warningIntervals = [43200, 20160, 10080, 4320, 1440, 360, 180, 60, 30];

    // Check each guild the bot is in
    client.guilds.cache.each(async (guild) => {
      // Check each channel in the guild
      guild.channels.cache.each(async (channel) => {
        // If the channel is a text channel in the "future events" category
        if (channel.type === 'GUILD_TEXT' && channel.parent && channel.parent.name === 'future events') {
          // Fetch the latest message in the channel
          const messages = await channel.messages.fetch({ limit: 1 });
          const latestMessage = messages.first();

          // If the latest message is an embed with a date and time field
          if (latestMessage && latestMessage.embeds[0] && latestMessage.embeds[0].fields.find(field => field.name === 'Date') && latestMessage.embeds[0].fields.find(field => field.name === 'Time')) {
            // Get the event date and time
            const eventDateField = latestMessage.embeds[0].fields.find(field => field.name === 'Date');
            const eventTimeField = latestMessage.embeds[0].fields.find(field => field.name === 'Time');
            const eventDateTime = moment(`${eventDateField.value} ${eventTimeField.value}`, 'YYYY-MM-DD HH:mm');

            // Schedule warning messages for each warning interval
            warningIntervals.forEach((interval) => {
              const warningDateTime = moment(eventDateTime).subtract(interval, 'minutes');
              schedule.scheduleJob(warningDateTime.toDate(), async () => {
                // Send a warning message in the channel
                await channel.send(`The event is starting in ${interval} minutes!`);
              });
            });

            // Schedule a message for when the event starts
            schedule.scheduleJob(eventDateTime.toDate(), async () => {
              // Send a "enjoy the movie" message in the channel
              await channel.send('Enjoy the movie!');
              // Move the channel to the "archived events" category
              const archivedEventsCategory = guild.channels.cache.find(category => category.name === 'archived events' && category.type === 'GUILD_CATEGORY');
              if (archivedEventsCategory) {
                await channel.setParent(archivedEventsCategory);
              }
            });
          }
        }
      });
    });
  },
};