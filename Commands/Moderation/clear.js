const { SlashCommandBuilder, ChatInputCommandInteraction, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('clear a certain amount of messages from a channel or user')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addNumberOption(option => 
        option.setName("amount")
            .setDescription("Amount of messages you want to delete")
            .setRequired(true))
    .addUserOption(option => 
        option.setName("target")
            .setDescription("Select a target you want to delete messages ONLY from")
            .setRequired(false)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {

        const Amount = interaction.options.getNumber('amount');
        const Target = interaction.options.getUser('target');

        const Messages = await interaction.channel.messages.fetch();

        const Response = new EmbedBuilder()
        .setColor('Red')

        if(Target) {
            let i = 0;
            const filtered = [];
            (await Messages).filter((m) => {
                if(m.author.id === Target.id && Amount > i) {
                    filtered.push(m);
                    i++;
                }
            })

            await interaction.channel.bulkDelete(filtered, true).then(messages => {
                Response.setDescription(`🧹 Cleared ${messages.size} from ${Target}.`);
                interaction.reply({embeds: [Response]});
            })
        } else {
            await interaction.channel.bulkDelete(Amount, true).then(messages => {
                Response.setDescription(`🧹 Cleared ${messages.size} from this channel.`);
                interaction.reply({embeds: [Response]});
            })
        } 
    }
}
