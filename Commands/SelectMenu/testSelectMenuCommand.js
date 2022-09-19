const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
  .setName("test-selectmenu-handler").setDescription("Test the select menu handler.").setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  /**
   * 
   * @param {ChatInputCommandInteraction} interaction 
   */
  execute(interaction) {
    const Row = new ActionRowBuilder().addComponents( new SelectMenuBuilder().setCustomId("TestSelectMenu").setPlaceholder("Nothing Selected").addOptions({ label: 'Select me', description: 'This is a description', value: 'first_option' }, { label: 'You can select me too', description: 'This is also a description', value: 'second_option' }, { label: 'I am also an option', description: 'This is a description as well', value: 'third_option' }))

    interaction.reply({ embeds: [ new EmbedBuilder().setDescription(`✅ | Test Select Menu Handler`).setColor(`#00d26a`) ], components: [Row], ephemeral: true });
  }
}