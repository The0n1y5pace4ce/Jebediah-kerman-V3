const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "interactionCreate",
    async execute(interaction, client) {
    if (!interaction.isSelectMenu()) return;
  
    const selectMenu = client.selectMenus.get(interaction.customId);

    if (!selectMenu) return;
  
    if (selectMenu == undefined) return;

    if (selectMenu.permission && !interaction.member.permissions.has(selectMenu.permission)) return interaction.reply({ embeds: [ new EmbedBuilder().setDescription( `⛔ | You don't have the required permissions to use this.`).setColor("#f8312f") ], ephemeral: true });
  
    if (selectMenu.developer && interaction.user.id !== "CHANGEME") return interaction.reply({ embeds: [ new EmbedBuilder().setDescription( `⛔ | This select menu is for developers only.`).setColor("#f8312f") ], ephemeral: true });

    await selectMenu.execute(interaction, client);
  },
};