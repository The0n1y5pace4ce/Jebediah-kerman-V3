const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChatInputCommandInteraction,
    EmbedBuilder,
    Client,
    ChannelType,
  } = require("discord.js");
  
  const mongoose = require("mongoose");
  const banSchema = require("../../Structures/schemas/banSchema");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("ban")
      .setDescription("Ban a member!")
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
      .addSubcommand((subcommand) =>
        subcommand
          .setName("user")
          .setDescription("Ban a user!")
          .addUserOption((option) =>
            option
              .setName("target")
              .setDescription("User to ban.")
              .setRequired(true)
          )
          .addStringOption((option) =>
            option
              .setName("reason")
              .setDescription("Reason for the ban.")
              .setRequired(true)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("setup")
          .setDescription("Setup the ban logs.")
          .addChannelOption((option) =>
            option
              .setName("channel")
              .setDescription("Channel to send the message to.")
              .addChannelTypes(ChannelType.GuildText)
              .setRequired(true)
          )
      ),
  
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
      if (interaction.options.getSubcommand() === "user") {
        const embed = new EmbedBuilder();
  
        const { options } = interaction;
        const target = options.getMember("target");
        const reason = options.getString("reason") || "No reason provided";
        await target.user.fetch().catch((err) => console.log(err));
  
        if (!target) {
          //for whatever reason //
          interaction.reply({
            embeds: [
              embed
                .setColor("Red")
                .setDescription("The target is not a valid member."),
            ],
          });
          return;
        }
  
        //optional //
  
        // if (target.user == client.bot.user) {
        //     interaction.reply({ embeds: [embed.setColor("RED").setDescription("You cannot ban bots.")] });
        //     return;
        // }
  
        if (target.user.id === client.user.id) {
          interaction.reply({
            embeds: [embed.setColor("Red").setDescription("You cannot ban me!")],
          });
          return;
        }
  
        if (target.user.id === interaction.user.id) {
          interaction.reply({
            embeds: [
              embed
                .setColor("Yellow")
                .setDescription("You cannot ban yourself dummy."),
            ],
          });
          return;
        }
  
        if (
          target.roles.highest.position >=
          interaction.member.roles.highest.position
        ) {
          interaction.reply({
            embeds: [
              embed
                .setColor("Red")
                .setDescription(
                  "The member has a higher role than you so i cannot ban them."
                ),
            ],
          });
          return;
        }
  
        if (!interaction.guild.members.me.permissions.has("BanMembers")) {
          interaction.reply({
            embeds: [
              embed
                .setColor("Red")
                .setDescription("I do not have the permission to ban members."),
            ],
          });
          return;
        }
  
        const banSys = await banSchema.findOne({ guildId: interaction.guild.id });
  
        if (banSys) {
          const newBanSchema = new banSchema({
            _id: mongoose.Types.ObjectId(),
            guildId: interaction.guild.id,
            userId: target.id,
            banReason: reason,
            banTime: new Date(),
          });
  
          await newBanSchema.save().catch((err) => console.log(err));
        }
  
        // if(banSys) {
        //   banSys.userId = target.id;
        //   banSys.banReason = reason;
        //   banSys.banTime = new Date();
        //   await banSys.save().catch((err) => console.log(err));
        // }
  
        if (banSys.channelId) {
          interaction.guild.channels.cache.get(banSys.channelId).send({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setTitle(`User banned by ${interaction.member.user.tag}`)
                .addFields(
                  {
                    name: "Banned User",
                    value: `<@${target.id}>`,
                  },
                  {
                    name: "User ID",
                    value: `${target.id}`,
                  },
                  {
                    name: "Banned At",
                    value: `${new Date().toISOString()}`,
                  },
                  {
                    name: "Reason",
                    value: `\`\`\`${reason}\`\`\``,
                  }
                ),
            ],
          });
        }
  
        const response = new EmbedBuilder()
          .setTitle("Successfully banned the target!")
          .setColor("Green")
          .setThumbnail(target.user.avatarURL({ dynamic: true }))
          .setImage(target.user.bannerURL({ dynamic: true, size: 512 }))
          .addFields(
            { name: "ID", value: target.user.id },
            { name: "Reason", value: reason },
            {
              name: "Joined Server",
              value: `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`,
              inline: true,
            },
            {
              name: "Account Created",
              value: `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`,
              inline: true,
            }
          );
  
        try {
          const targetDM = new EmbedBuilder()
            .setTitle(
              `You have been banned from the server!: ${interaction.guild}`
            )
            .setColor("Red")
            .setThumbnail(target.user.avatarURL({ dynamic: true }))
            .setImage(target.user.bannerURL({ dynamic: true, size: 512 }))
            .addFields(
              { name: "ID", value: target.user.id },
              { name: "Reason", value: reason },
              {
                name: "Joined Server At",
                value: `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`,
                inline: true,
              }
            );
          await target.send({ embeds: [targetDM], ephemeral: true });
        } catch (err) {
          if (err) {
            await interaction.channel.send({
              embeds: [
                embed
                  .setColor("Red")
                  .setDescription(
                    `The target could not be DM'd about the BAN info because they have disabled DM's!`
                  ),
              ],
              ephemeral: true,
            });
          }
        }
  
        await interaction.deferReply();
        await interaction.followUp({ embeds: [response] });
        await target.ban({ days: 0, reason: reason });
      } else if (interaction.options.getSubcommand("setup")) {
        const channel = interaction.options.getChannel("channel");
  
        const banLogs = await banSchema.findOne({
          guildId: interaction.guild.id,
        });
  
        if (!banLogs) {
          const newBanSchema = new banSchema({
            _id: mongoose.Types.ObjectId(),
            guildId: interaction.guild.id,
            channelId: channel.id,
            userId: "temp",
            banReason: "temp",
            banTime: "temp",
          });
  
          await newBanSchema.save().catch((err) => console.log(err));
          const successEmbed = new EmbedBuilder()
            .setDescription(
              `Ban logs are now enabled in <#${channel.name}>!`
            )
            .setColor("#00ff00");
  
          interaction.reply({
            embeds: [successEmbed],
          });
        } else if (banLogs) {
          const newBanSchema = await banSchema.findOneAndUpdate(
            {
              guildId: interaction.guild.id,
            },
            {
              $set: {
                channelId: channel.id,
              },
            }
          );
  
          const successEmbed = new EmbedBuilder()
            .setDescription(
              `Ban logs are now enabled in <#${channel.id}>!`
            )
            .setColor("#00ff00");
  
          interaction.reply({
            embeds: [successEmbed],
          });
        }
      }
    },
  };