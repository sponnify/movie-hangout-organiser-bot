const { Permissions } = require('discord.js');

module.exports = {
  name: 'guildCreate',
  async execute(guild) {
    try {
      // Send a message to the server owner asking for confirmation to set up the server
      const owner = guild.owner;
      await owner.send('Do you want me to set up the server? Reply with "yes" to confirm.');

      // Listen for the owner's response
      const filter = m => m.author.id === owner.id;
      const collector = owner.dmChannel.createMessageCollector(filter, { max: 1, time: 60000 }); // Collect 1 message within 60 seconds

      collector.on('collect', async m => {
        if (m.content.toLowerCase() === 'yes') {
          // The owner has confirmed, begin setting up the server

          // Create "announcements" category
          const announcementsCategory = await guild.channels.create('announcements', { type: 'GUILD_CATEGORY' });

          // Create "future events" channel under "announcements" category
          const futureEventsChannel = await guild.channels.create('future events', {
            type: 'GUILD_TEXT',
            parent: announcementsCategory,
            permissionOverwrites: [
              {
                id: guild.roles.everyone,
                deny: [Permissions.FLAGS.SEND_MESSAGES],
              },
            ],
          });

          // Create "how to use the bot" channel under "announcements" category
          const howToUseBotChannel = await guild.channels.create('how to use the bot', {
            type: 'GUILD_TEXT',
            parent: announcementsCategory,
            permissionOverwrites: [
              {
                id: guild.roles.everyone,
                deny: [Permissions.FLAGS.SEND_MESSAGES],
              },
            ],
          });

          // Create "planner" role
          const plannerRole = await guild.roles.create({
              name: 'planner',
              permissions: [], // Specify any permissions you want the role to have
          });  

          // Send a message in "how to use the bot" channel
          await howToUseBotChannel.send('Here is some detailed information on how to use the bot...');

          // Create "future events" category
          const futureEventsCategory = await guild.channels.create('future events', { type: 'GUILD_CATEGORY' });

          // Create "archived events" category
          const archivedEventsCategory = await guild.channels.create('archived events', { type: 'GUILD_CATEGORY' });

          // Find and delete "voice channels" category
          const voiceChannelsCategory = guild.channels.cache.find(category => category.name === 'voice channels' && category.type === 'GUILD_CATEGORY');
          if (voiceChannelsCategory) {
            // Delete all channels in the "voice channels" category
            voiceChannelsCategory.children.each(async (channel) => {
              await channel.delete();
            });
            // Delete the "voice channels" category
            await voiceChannelsCategory.delete();
          }
        } else {
          // The owner did not confirm, do not set up the server
          await owner.send('Server setup cancelled.');
        }
      });

      collector.on('end', collected => {
        if (collected.size === 0) {
          // The owner did not respond within the time limit, do not set up the server
          owner.send('Server setup cancelled due to no response.');
        }
      });
    } catch (error) {
      console.error(error);
    }
  },
};