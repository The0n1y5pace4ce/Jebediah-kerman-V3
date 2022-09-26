const { devID } = require('../../Structures/config.json');
const { SlashCommandBuilder, ChatInputCommandInteraction, CommandInteraction, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('reboot')
    .setDescription('Reboot the bot (DANGEROUS)'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        if(interaction.member.id === devID) {
            interaction.reply({
                content: 'Restarting . . .', ephemeral: true,
              }).then(() => {
                process.on('exit', () => {
                  require('child_process').spawn(process.argv.shift(), process.argv, {
                    cwd: process.cwd(),
                    detached: true,
                    stdio: 'inherit'
                  })
                })
                process.exit()
              })
        } else {
            interaction.reply({content: 'You cannot use this command.', ephemeral: true})
        }
    }
}
