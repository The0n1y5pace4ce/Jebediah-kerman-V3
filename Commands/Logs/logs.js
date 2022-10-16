const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");

const warnSchema = require("../../Structures/schemas/warnSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warnlogs")
    .setDescription("Get the logs of a user")
    .addSubcommand((subCmd) =>
      subCmd
        .setName("warns")
        .setDescription("Get the warns of a user")
        .addUserOption((option) => {
          return option
            .setName("user")
            .setDescription("User to get the warn logs for")
            .setRequired(true);
        })
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    switch (interaction.options.getSubcommand()) {
      case "warns":
        {
          const user = interaction.options.getUser("user");

          const userWarnings = await warnSchema.find({
            userId: user.id,
            guildId: interaction.guild.id,
          });

          const err = new EmbedBuilder()
            .setTitle("User Warn Logs")
            .setDescription(`${user} has no warn logs`)
            .setColor("Red");

          if (!userWarnings?.length)
            return interaction.reply({ embeds: [err] });

          const embedDescription = userWarnings
            .map((warn) => {
              const moderator = interaction.guild.members.cache.get(
                warn.moderator
              );

              return [
                `Warn ID: ${warn.id}`,
                `Moderator: ${
                  moderator || "Moderator left"
                }`,
                `User: ${warn.userId}`,
                `Reason: \`${warn.warnReason}\``,
                `Date: ${warn.warnDate}`,
              ].join("\n");
            })
            .join("\n\n");

          const embed = new EmbedBuilder()
            .setTitle(`${user.tag}'s warn logs`)
            .setDescription(embedDescription)
            .setColor("#2f3136");

          await interaction.reply({ embeds: [embed] });
        }
        break;

      default:
        break;
    }
  },
};