const { SlashCommandBuilder, ChatInputCommandInteraction, CommandInteraction, PermissionFlagsBits, MessageEmbed } = require('discord.js')
const  { loadCommands } = require('../../Structures/Handlers/commandHandler') 
const  { loadEvents } = require('../../Structures/Handlers/eventHandler') 
const { loadButtons } = require('../../Structures/Handlers/buttonHandler')
const { loadModals } = require('../../Structures/Handlers/modalHandler')
const { loadSelectMenus } = require('../../Structures/Handlers/selectMenuHandler')

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload commands/events.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((options) => 
    options.setName("events").setDescription("Reload Events"))
    .addSubcommand((options) =>
    options.setName('commands').setDescription('Reload Commands'))
    .addSubcommand((options) => 
    options.setName('buttons').setDescription('Reload Buttons'))
    .addSubcommand((options) => 
    options.setName('modals').setDescription('Reload Modals'))
    .addSubcommand((options) => 
    options.setName('selectmenus').setDescription('Reload Select Menus')),
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
            case "buttons": {
                loadButtons(client)
                interaction.reply({content: 'buttons have been reloaded.', ephemeral: true})
            }
            break;
            case "modals": {
                loadModals(client)
                interaction.reply({content: 'Modals have been reloaded.', ephemeral: true})
            }
            break;
            case "selectmenus": {
                loadSelectMenus(client)
                interaction.reply({content: 'Select Menus have been reloaded.', ephemeral: true})
            }
            break;
        }
    }
}