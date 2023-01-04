const { ChatInputCommandInteraction, Client, EmbedBuilder, TextInputBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, PermissionsBitField, TextInputStyle, SlashCommandBuilder } = require("discord.js");
const DB = require("../../Structures/schemas/GiveawayDB");
const { endGiveaway } = require("../../Structures/Utils/GiveawayFunctions");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Create or manage a giveaway')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
    .setDMPermission(false)
    .addSubcommand(option => 
        option.setName('create')
        .setDescription('Create a giveaway'))
    .addSubcommand(option => 
        option.setName('manage')
            .setDescription('Manage a giveaway')
            .addStringOption(option => 
                option.setName('toggle')
                .setDescription('Provide an option to manage')
                .setRequired(true)
                .addChoices(
                    { name: "End", value: "end" }, 
                    { name: "Pause", value: "pause" }, 
                    { name: "Unpause", value: "unpause" }, { name: "Reroll", value: "reroll" }, 
                    { name: "Delete", value: "delete" },))
                .addStringOption(option => 
                    option.setName('message_id')
                    .setDescription('Provide the message ID of the giveaway')
                    .setRequired(true))),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case "create": {
                const prize = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("giveaway-prize")
                        .setLabel("Prize")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(256)
                        .setRequired(true)
                );

                const winners = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("giveaway-winners")
                        .setLabel("Winner Count")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                );

                const duration = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("giveaway-duration")
                        .setLabel("Duration")
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder("Example: 1 day")
                        .setRequired(true)
                );
                
                const modal = new ModalBuilder()
                    .setCustomId("giveaway-options")
                    .setTitle("Create a Giveaway")
                    .setComponents(prize, winners, duration);

                await interaction.showModal(modal);
            }
            break;

            case "manage": {
                const embed = new EmbedBuilder();
                const messageId = interaction.options.getString("message_id");
                const toggle = interaction.options.getString("toggle");

                const data = await DB.findOne({
                    GuildID: interaction.guild.id,
                    MessageID: messageId
                });
                if (!data) {
                    embed
                        .setColor("Red")
                        .setDescription("Could not find any giveaway with that message ID");
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                const message = (await interaction.guild.channels.cache.get(data.ChannelID).messages.fetch(messageId));
                if (!message) {
                    embed
                        .setColor("Red")
                        .setDescription("This giveaway doesn't exist");
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                if (["end", "reroll"].includes(toggle)) {
                    if (data.Ended === (toggle === "end" ? true : false)) {
                        embed
                            .setColor("Red")
                            .setDescription(`This giveaway has ${toggle === "end" ? "already ended" : "not ended"}`);
                        return interaction.reply({ embeds: [embed], ephemeral: true });
                    }

                    if (toggle === "end" && data.Paused === true) {
                        embed
                            .setColor("Red")
                            .setDescription("This giveaway is paused. Unpause it before ending the giveaway");
                        return interaction.reply({ embeds: [embed], ephemeral: true });
                    }

                    endGiveaway(message, (toggle === "end" ? false : true));

                    embed
                        .setColor("Green")
                        .setDescription(`The giveaway has ${toggle === "end" ? "ended" : "been rerolled"}`);
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                if (["pause", "unpause"].includes(toggle)) {
                    if (data.Ended) {
                        embed
                            .setColor("Red")
                            .setDescription("This giveaway has already ended");
                        return interaction.reply({ embeds: [embed], ephemeral: true });
                    }

                    if (data.Paused === (toggle === "pause" ? true : false)) {
                        embed
                            .setColor("Red")
                            .setDescription(`This giveaway is already ${toggle === "pause" ? "paused" : "unpaused"}`);
                        return interaction.reply({ embeds: [embed], ephemeral: true });
                    }

                    const button = ActionRowBuilder.from(message.components[0]).setComponents(ButtonBuilder.from(message.components[0].components[0]).setDisabled(toggle === "pause" ? true : false));

                    const giveawayEmbed = EmbedBuilder.from(message.embeds[0]).setColor(toggle === "pause" ? "Yellow" : "#156789");

                    await DB.findOneAndUpdate({
                        GuildID: interaction.guild.id,
                        MessageID: message.id
                    }, { Paused: toggle === "pause" ? true : false });
                    
                    await message.edit({ content: `🎉 **Giveaway ${toggle === "pause" ? "Paused" : "Started"}** 🎉`, embeds: [giveawayEmbed], components: [button] });

                    embed
                        .setColor("Green")
                        .setDescription(`The giveaway has been ${toggle === "pause" ? "paused" : "unpaused"}`);
                    interaction.reply({ embeds: [embed], ephemeral: true });

                    if (toggle === "unpause" && (data.EndTime * 1000) < Date.now()) endGiveaway(message);
                }

                if (toggle === "delete") {
                    await DB.deleteOne({
                        GuildID: interaction.guild.id,
                        MessageID: message.id
                    });

                    await message.delete();
                    embed
                        .setColor("Green")
                        .setDescription("The giveaway has been deleted");
                    interaction.reply({ embeds: [embed], ephemeral: true });
                }
            }
            break;
        }
    },
};