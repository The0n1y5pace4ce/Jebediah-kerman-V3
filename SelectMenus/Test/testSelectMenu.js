const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  id: "TestSelectMenu",
  permission: PermissionFlagsBits.Administrator,
  /**
   * 
   * @param {ChatInputCommandInteraction} interaction 
   */
  execute(interaction) {
    if (interaction.values.includes('first_option')) {
      interaction.reply({ embeds: [ new EmbedBuilder().setDescription(`✅ | Successful reply for the first option`).setColor(`#00d26a`) ], ephemeral: true });
    } else if (interaction.values.includes('second_option')) {
      interaction.reply({ embeds: [ new EmbedBuilder().setDescription(`✅ | Successful reply for the second option`).setColor(`#00d26a`) ], ephemeral: true });
    } else if (interaction.values.includes('third_option')) {
      interaction.reply({ embeds: [ new EmbedBuilder().setDescription(`✅ | Successful reply for the third option`).setColor(`#00d26a`) ], ephemeral: true });
    }
  },
};
