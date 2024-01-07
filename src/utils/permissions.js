const { Permissions } = require('discord.js');

function canUserManageMessages(member) {
  return member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);
}

module.exports = { canUserManageMessages };