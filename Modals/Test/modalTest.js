const { EmbedBuilder, CommandInteraction, PermissionFlagsBits } = require("discord.js");

module.exports = {
  id: "TestModal",
  developer: true,
  permission: PermissionFlagsBits.Administrator,
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
  const input = interaction.fields.getTextInputValue("Test_Modal");

  await interaction.reply({ embeds: [ new EmbedBuilder().setColor(`#00d26a`).setDescription(`✅ | Test Modal Handler`).setFields({ name: `Input`, value: `${input}` }) ], ephemeral: true });
  },
};