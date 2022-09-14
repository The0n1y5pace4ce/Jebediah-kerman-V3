const { SlashCommandBuilder, ChatInputCommandInteraction, CommandInteraction, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('activity')
    .setDescription('Sets the activity for the bot (DEV ONLY)')
    .addStringOption(option => 
        option.setName('type')
            .setDescription('Choose between adding or removing the activity from the bot.')
            .setRequired(true)
            .addChoices(
                {name: 'add', value: 'add'},
                {name: 'remove', value: 'remove'},
            ))
    .addStringOption(option => 
        option.setName('text')
            .setDescription('Enter the activity text')
            .setRequired(true))
    .addStringOption(option => 
        option.setName('activity')
            .setDescription('Choose the activity.')
            .setRequired(false)
            .addChoices(
                { name: 'WATCHING', value: 'WATCHING'},
                { name: 'PLAYING', value: 'PLAYING' },
                { name: 'LISTENING', value: 'LISTENING' },
            ))
    ,
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        if(interaction.member.id === "656306365534437386") {
            const type = interaction.options.getString('type');
            const activity = interaction.options.getString('activity');
            const text     = interaction.options.getString('text');

            switch (type) {
                case 'add':
                        client.user.setActivity({ type: `${activity}`, name: `${text}` });
                        interaction.reply({ content: `Done!`, ephemeral: true });
                    break;
                case 'remove': {
                        client.user.setPresence({ activity: null });
                        interaction.reply({ content: `Done!`, ephemeral: true });
                    break;
                }
            }
        }
        else {
            interaction.reply({content: 'Only the dev can use this command!'})
        }
    }
}
