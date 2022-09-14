const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const axios = require('axios').default;
module.exports = {
    data: new SlashCommandBuilder()
        .setName('advice')
        .setDescription('Get the perfect bit of life advice'),
              /**
         * @param {ChatInputCommandInteraction} interaction
         */
        execute(interaction) {
            axios.get("https://api.adviceslip.com/advice").then((response) => {
                interaction.reply({ content: response.data.slip.advice });
            }).catch(() => {
                    interaction.reply({ content: "An error occurred" });
            });
        }
}