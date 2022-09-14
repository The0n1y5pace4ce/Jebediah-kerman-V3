const { SlashCommandBuilder, ChatInputCommandInteraction, CommandInteraction, PermissionFlagsBits, MessageEmbed } = require('discord.js')
const  { loadCommands } = require('../../Handlers/commandHandler') 
const  { loadEvents } = require('../../Handlers/eventHandler') 

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload commands/events.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((options) => 
    options.setName("events").setDescription("Reload Events"))
    .addSubcommand((options) =>
    options.setName('commands').setDescription('Reload Commands')),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute(interaction, client) {
        const sub = interaction.options.getSubcommand()
        switch(sub) {
            case "events": {
                for (const [key, value] of client.events)
                client.removeListener(`${key}`, value, true)
                client.removeAllListeners(); 
                loadEvents(client)
                interaction.reply({content: 'Events have been reloaded.', ephemeral: true})
            }
            break;
            case "commands": {
                loadCommands(client)
                interaction.reply({content: 'Commands have been reloaded.', ephemeral: true})
            }
            break;
        }
    }
}