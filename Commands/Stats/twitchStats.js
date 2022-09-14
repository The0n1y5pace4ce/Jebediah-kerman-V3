const {
    CommandInteraction,
    EmbedBuilder,
    ApplicationCommandOptionType,
  } = require("discord.js");
  const superagent = require("superagent");
  
  const data = {
    name: "twitchinfo",
    description: "Get information on a twitch account",
    options: [
      {
        name: "user",
        description: "User to get information on",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
    toJSON: () => ({ ...data }),
  };
  
  module.exports = {
    data,
    ...data,
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction) {
      const { options, member } = interaction;
      const channelName = options.getString("user");
  
      interaction.deferReply();
      if (!channelName)
        return interaction.reply({
          content: "Please enter a twitch channel",
          ephermeral: true,
        });
  
      try {
        const Response = await superagent.get(
          `https://api.crunchprank.net/twitch/followcount/${channelName.toLowerCase()}`
        );
        const upTime = await superagent.get(
          `https://api.crunchprank.net/twitch/uptime/${channelName.toLowerCase()}`
        );
        const totalViews = await superagent.get(
          `https://api.crunchprank.net/twitch/total_views/${channelName.toLowerCase()}`
        );
        const accountage = await superagent.get(
          `https://api.crunchprank.net/twitch/creation/${channelName.toLowerCase()}`
        );
        const lastGame = await superagent.get(
          `https://api.crunchprank.net/twitch/game/${channelName.toLowerCase()}`
        );
        const avatarimg = await superagent.get(
          `https://api.crunchprank.net/twitch/avatar/${channelName.toLowerCase()}`
        );
  
        const embed = new EmbedBuilder()
  
          .setColor("#e100ff")
          .setTitle(`Twitch stats for: ${channelName}`)
          .setDescription(
            `❣️ **Followers**: ${Response.text} \n
              👀 **Views**: ${totalViews.text}\n 
              ⬆ **Uptime**: ${upTime.text} \n
              📝 **Created at**: ${accountage.text}  \n
              ⏮️ **Last game played**: ${lastGame.text} \n
              🔴 **Current status**: ${upTime.text}`
          )
          .setFooter({
            text: `Info requested by: ${member.user.tag}`,
            iconURL: member.user.displayAvatarURL(),
          })
          .setURL(`https://twitch.tv/${channelName}`)
          .setThumbnail("https://pngimg.com/uploads/twitch/twitch_PNG27.png")
          .setImage(`${avatarimg.text}`)
          .setTimestamp();
  
        interaction.editReply({ embeds: [embed] }).catch((error) => {
          interaction.editReply({
            content: `The user ${channelName} is not a valid user please try again`,
            ephermeral: true,
          });
        });
  
        if (upTime.text === `${channelName} is offline`) {
          upTime.text = "is offline";
        }
      } catch (error) {
        console.error(error);
        return interaction.reply({
          content:
            "An error has occurred while processing the information, please try again later.",
          ephermeral: true,
        });
      }
    },
  };
  