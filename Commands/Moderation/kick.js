const { SlashCommandBuilder, ChatInputCommandInteraction, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a misbehaving member from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option => 
        option.setName('user')
            .setDescription('User to kick')
            .setRequired(true))
    .addStringOption(option => 
        option.setName('reason')
            .setDescription("Reason for member kick")
            .setRequired(false)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction, guild) {
		const Target = interaction.options.getMember("user");
		const Reason = interaction.options.getString("reason") || "no reason"

		const success = new EmbedBuilder()
		.setDescription(`**${Target} was Successfully kicked**\n ||This Member was kicked for ${Reason}||`)
		.setColor("DarkAqua")
		if (Target.id ===
            interaction.member.id)
		return interaction.reply({embeds: [new EmbedBuilder().setColor("Blue").setDescription("You can't kick yourself")]})

		if (Target.permissions.has(PermissionFlagsBits.Administrator))
		return interaction.reply({embeds: [new EmbedBuilder().setColor("Blue").setDescription("**LoL** You can't kick an Admin")]})
		
		if (Target.permissions.has(PermissionFlagsBits.ManageGuild))
		return interaction.reply({embeds: [new EmbedBuilder().setColor("Blue").setDescription("**LoL** You can't kick a Moderator")]})
       
        Target.kick({reason: Reason}).then(
            Target.send({embeds: [new EmbedBuilder().setColor("Blue").setDescription(`You were kicked from **${guild.name}** for __${Reason}__ `)], content: "Remember to not to repeat that mistake again you can join using https://discord.gg/R8XGQ3vNbU"})
            .catch((err))
        )

		interaction.reply({embeds:[success]})
    }
}
