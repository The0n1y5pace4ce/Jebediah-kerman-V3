const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
  .setName("test-modal-handler").setDescription("Test the modal handler!").setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const InputField = new TextInputBuilder().setCustomId("Test_Modal").setLabel("Test Modal Handler").setPlaceholder("Test modal input").setMaxLength(1000).setMinLength(1).setStyle(TextInputStyle.Paragraph);

    const TestModalTextModalInputRow = new ActionRowBuilder().addComponents(InputField);

    const modal = new ModalBuilder().setCustomId("TestModal").setTitle("Test Modal Handler").addComponents(TestModalTextModalInputRow);

    await interaction.showModal(modal);
  }
};
