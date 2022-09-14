const { ChatInputCommandInteraction } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction, client) {
    if(!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return interaction.reply({content: 'This Command Is Outdated.', ephemeral: true,})

    if(command.developer && interaction.user.id !== "656306365534437386")
    return interaction.reply({content: 'This command is only available to the developer.', ephemeral: true,})

    command.execute(interaction, client)
  }
}