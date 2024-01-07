const { CommandInteraction, ContextMenuInteraction } = require('discord.js');

// Custom error class
class CommandNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "CommandNotFoundError";
  }
}

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    try {
      // If the interaction is a command
      if (interaction.isCommand()) {
        // Get the command from the client's commands collection
        const command = interaction.client.commands.get(interaction.commandName);

        // If the command is not found, reply with an error message
        if (!command) {
          throw new CommandNotFoundError('Command not found!');
        }

        // Try to execute the command
        try {
          await command.execute(interaction);
        } catch (error) {
          console.error(error);
          await interaction.reply({ content: 'An error occurred while executing this command!', ephemeral: true });
        }
      }
      // If the interaction is a context menu interaction
      else if (interaction.isContextMenu()) {
        // Get the command from the client's commands collection
        const command = interaction.client.commands.get(interaction.commandName);

        // If the command is not found, reply with an error message
        if (!command) {
          throw new CommandNotFoundError('Command not found!');
        }

        // Try to execute the command
        try {
          await command.execute(interaction);
        } catch (error) {
          console.error(error);
          await interaction.reply({ content: 'An error occurred while executing this command!', ephemeral: true });
        }
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: `An error occurred: ${error.message}`, ephemeral: true });
    }
  },
};