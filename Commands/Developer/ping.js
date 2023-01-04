const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { execute } = require('./Embed')

module.exports = {
    data: new SlashCommandBuilder()
    .setTitle('ping')
    .setDescription('Ping pong command')
    .setDefaultMemberPermission(PermissionFlagsBits.Administrator),

    execute(interaction) {
        interaction.reply('Pong!')
    }
}