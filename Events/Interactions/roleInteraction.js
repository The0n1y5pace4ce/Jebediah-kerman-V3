const { Client, EmbedBuilder, SelectMenuInteraction } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    /**
     * @param {SelectMenuInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (!interaction.isSelectMenu()) return;
        if (interaction.customId !== "role-menu") return;
        const embed = new EmbedBuilder();

        const roleToGive = interaction.values[0];
        const roleFetched = await interaction.guild.roles.fetch(roleToGive);
        if (!roleFetched) {
            embed
                .setColor("Red")
                .setDescription(`This role doesn't exist`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (roleFetched.managed || !roleFetched.editable) {
            embed
                .setColor("Red")
                .setDescription(`I cannot give this role to you`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const hasRole = interaction.member.roles.cache.has(roleToGive);

        embed
            .setColor("Green")
            .setDescription(`${hasRole ? "Removed" : "Added"} the ${roleFetched} role ${hasRole ? "from" : "to"} you`);

        const errorEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`I do not have permission to ${hasRole ? "remove" : "add"} that role ${hasRole ? "from" : "to"} you`);

        if (hasRole) {
            return interaction.member.roles.remove(roleFetched)
                .then(() => interaction.reply({ embeds: [embed], ephemeral: true }))
                .catch(() => interaction.reply({ embeds: [errorEmbed], ephemeral: true }));
        } else {
            return interaction.member.roles.add(roleFetched)
                .then(() => interaction.reply({ embeds: [embed], ephemeral: true }))
                .catch(() => interaction.reply({ embeds: [errorEmbed], ephemeral: true }));
        }
    }
};