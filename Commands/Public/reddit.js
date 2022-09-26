const { SlashCommandBuilder, ChatInputCommandInteraction, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js')
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('reddit')
    .setDescription('get a post from any subreddit')
    .addStringOption(option => 
        option.setName("subreddit")
        .setDescription("the subreddit to get a post from")
        .setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const name = interaction.options.getString("subreddit");

        const url = "https://meme-api.herokuapp.com/gimme/";

        const meme = url+name;

        let data, response;

        try {
            response = await axios.get(meme);
            data = response.data;
        } catch (e) {
            if(e){
                if (e.message.startsWith("Request failed with status code")){
                    const Response = new EmbedBuilder()

                        .setTitle("ERROR")
                        .setColor("Red")
                        .addFields(
                            { name: "Error", value: "The subreddit you requested does not exist" }
                        )

                    await interaction.reply({ embeds: [Response], fetchReply: true })
                }else if (e){
                    const errorEmbed = new EmbedBuilder()
                        .setTitle("Oh no...")
                        .setColor("Red")
                        .addFields(
                            { name: "Error", value: `\`\`\`Please Try Again\`\`\`` }
                        )
                    console.log(e.message)
                    return interaction.reply({embeds: [errorEmbed]}).then(msg => {setTimeout(() => msg.delete(), 5000)})
                }
            }
        }

        if(data == null){
            return;
        }else{
            if (data.nsfw === false) {
                const Response = new EmbedBuilder()

                    .setTitle(data.title)
                    .setImage(data.url)

                const message = await interaction.reply({ embeds: [Response]});
            } else if (data.nsfw === true) {
                interaction.reply("No.");
            }
        }
    }
}
