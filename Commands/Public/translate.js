const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
  } = require("discord.js");
  
  const translate = require("translate-google");
  const ISO6391 = require("iso-639-1");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("translate")
      .setDescription("Translate the text")
      .addStringOption((uwagi) =>
        uwagi
          .setName("text")
          .setDescription("What text do you want to translate")
          .setRequired(true)
      )
      .addStringOption((uwagi) =>
        uwagi
          .setName("language")
          .setDescription("What language do you want the text translated into?")
          .setRequired(true)
      ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
      const text = interaction.options.getString("text");
      const language = interaction.options.getString("language");
      translate(text, { to: language })
        .then((result) => {
          const languageName = ISO6391.getName(language) || language;
          const Embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`Translated to ${languageName} language`)
            .addFields(
              {
                name: `Your text:`,
                value: `${text}`,
              },
              {
                name: `Translated text:`,
                value: `${result}`,
              }
            )
            .setFooter({
              text: `Language list here:\nhttps://cloud.google.com/translate/docs/languages `,
              iconURL:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Google_Translate_logo.svg/2048px-Google_Translate_logo.svg.png",
            });
          interaction.reply({ embeds: [Embed] });
        })
        .catch((err) => {
          console.error(err);
        });
    },
  };
  