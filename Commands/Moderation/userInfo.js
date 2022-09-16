const { SlashCommandBuilder, ChatInputCommandInteraction, CommandInteraction, PermissionFlagsBits, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { profileImage } = require('discord-arts')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Get info on a certain user')
    .addUserOption(option => 
        option.setName('user').setDescription('User to get info on').setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        await interaction.deferReply()
        const user = interaction.options.getUser('user')
        const bufferImg = await profileImage(user);
        const img = new AttachmentBuilder(bufferImg, { name: 'profile.png'})

        const embed = new EmbedBuilder()
        .setTitle(`User Info for ${user.username}`)
        .setImage('attachment://profile.png')

        await interaction.editReply({ embeds: [embed]})
    }
}
