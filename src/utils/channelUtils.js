// Utility function for finding channels by name
function findChannelByName(guild, name) {
    return guild.channels.cache.find(channel => channel.name === name);
  }
  
  // Utility function for finding categories by name
  function findCategoryByName(guild, name) {
    return guild.channels.cache.find(category => category.name === name && category.type === 'GUILD_CATEGORY');
  }
  
  module.exports = { findChannelByName, findCategoryByName };  