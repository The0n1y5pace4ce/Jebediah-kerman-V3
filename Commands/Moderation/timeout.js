const { SlashCommandBuilder, ChatInputCommandInteraction, CommandInteraction, PermissionFlagsBits, EmbedBuilder, Embed } = require('discord.js')
const ms = require('ms')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timout a user')
    .addSubcommand((option => 
        option.setName('mute').setDescription('Timeout a User').addUserOption(option => option.setName('user').setDescription('User to timeout').setRequired(true)).addStringOption(option => option.setName('length').setDescription('Length of the timeout').setRequired(true)).addStringOption(option => option.setName('reason').setDescription('Reason for timeout').setRequired(false))))
    .addSubcommand((option => 
        option.setName('unmute').setDescription('Untimeout a user').addUserOption(option => option.setName('user').setDescription('User to untimeout').setRequired(true)).addStringOption(option => option.setName('reason').setDescription('Reason for untimeout').setRequired(true)))),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const { options } = interaction.options
        const target = options.getUser("user");
        const length = options.getString("length");
        const reason = options.getString("reason") || "No Reason Provided";
        const maxtime = ms("28d")
        if(length) timeInMs = ms(length);

        try {
            switch (options.getSubcommand()) {
                case "mute": {
                    if (target.id === interaction.member.id)
                        return interaction.reply({
                        embeds: [new EmbedBuilder().setTitle("❌ Error ❌").setColor("Red")
                            .setDescription(`Hey... ${interaction.user.username} Why Are You Trying To Mute Yourself....?`).setTimestamp()
                        ],
                        ephemeral: true
                });
                    if (target.permissions.has(PermissionFlagsBits.Administrator))
                        return interaction.reply({
                        embeds: [new EmbedBuilder().setTitle("❌ Error ❌").setColor("Red")
                            .setDescription(`${target.user.username} Is An Admin....?`).setTimestamp()
                        ],  
                        ephemeral: true    
                });        
                    if(!timeInMs)
                        return interaction.reply({
                        embeds: [new EmbedBuilder().setTitle("❌ Error ❌").setColor("Red")
                            .setDescription("Please Specify A Valid Time!").setTimestamp()
                        ],
                        ephemeral: true
                });
                    if (timeInMs > maxtime )
                        return interaction.reply({
                        embeds: [new EmbedBuilder().setTitle("❌ Error ❌").setColor("Red")
                            .setDescription("Please Specify A Time Between 1 Second, And 28 Days!").setTimestamp()
                        ],
                        ephemeral: true
                });
                    if (reason.length > 512)
                        return interaction.reply({
                        embeds: [new EmbedBuilder().setTitle("❌ Error ❌").setColor("Red")
                            .setDescription("Reason Can't Be More Than 512 Characters").setTimestamp()
                        ],
                        ephemeral: true
                });
                    target.timeout(timeInMs, reason);
                        return interaction.reply({
                        embeds: [new EmbedBuilder().setColor("Green").setTitle(`Successfully Muted!`)
                            .addFields({
                            name: "User:",
                            value: `\`\`\`${target.user.username}\`\`\``
                        }, {
                            name: "Reason:",
                            value: `\`\`\`${reason}\`\`\``
                        },{
                            name: "Time Of Mute:",
                            value: `\`\`\`${length}\`\`\``
                        },
                        )
                        ],
                        ephemeral: true
                });
            }
                case "unmute": {
                    if (target.permissions.has(PermissionFlagsBits.Administrator))
                        return interaction.reply({
                        embeds: [new EmbedBuilder().setTitle("❌ Error ❌").setColor("Red")
                            .setDescription(`${target.user.username} Is An Admin....?`).setTimestamp()
                        ],
                        ephemeral: true
                });
                    if(!target.communicationDisabledUntilTimestamp)
                        return interaction.reply({
                        embeds: [new EmbedBuilder().setTitle("❌ Error ❌").setColor("Red")
                            .setDescription(`${target.user.username} Isn't Muted?`).setTimestamp()
                        ],
                        ephemeral: true
                });
                        await target.timeout(null)
                        return interaction.reply({
                        embeds: [new EmbedBuilder().setColor("Green").setTitle("Successfully Unmuted!")
                            .addFields({
                            name: "User:",
                            value: `\`\`\`${target.user.username}\`\`\``
                        },
                        {
                            name: "Reason:",
                            value: `\`\`\`${reason}\`\`\``
                        },
                        )
                        ],
                        ephemeral: true
                });
                }
                return;
            }
        } catch (e) {
        const errorEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`🛑 Error: ${e}`)
        return interaction.reply({
            embeds: [errorEmbed]
        })
        }
    }
}
