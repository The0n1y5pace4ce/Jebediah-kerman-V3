const { ButtonInteraction, Client, EmbedBuilder } = require("discord.js");
const DB = require("../../Structures/Schemas/GiveawayDB");

module.exports = {
    name: "interactionCreate",
    /**
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "giveaway-join") return;

        const embed = new EmbedBuilder();
        const data = await DB.findOne({
            GuildID: interaction.guild.id,
            ChannelID: interaction.channel.id,
            MessageID: interaction.message.id
        });

        if (!data) {
            embed
                .setColor("Red")
                .setDescription("There is no data in the database");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (data.Entered.includes(interaction.user.id)) {
            embed
                .setColor("Red")
                .setDescription("You have already joined the giveaway");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (data.Paused === true) {
            embed
                .setColor("Red")
                .setDescription("This giveaway is paused");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (data.Ended === true) {
            embed
                .setColor("Red")
                .setDescription("This giveaway has ended");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await DB.findOneAndUpdate({
            GuildID: interaction.guild.id,
            ChannelID: interaction.channel.id,
            MessageID: interaction.message.id
        }, {
            $push: { Entered: interaction.user.id }
        }).then(() => {
            embed
                .setColor("Green")
                .setDescription("You have joined the giveaway");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        });
    }
};