const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, } = require("discord.js");
const { PermissionFlagsBits, Colors } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote-kick')
        .setDescription('Creates a vote to kick member from your voice channel.')
        .addUserOption(option =>
            option
                .setName('member')
                .setDescription('Select the member you want to kick.')
                .setRequired(true)
        ),

    async execute(interaction) {

        const { member, options } = interaction;
        const target = options.getMember('member');

        if (!target.voice.channel) {
            return interaction.reply({ content: `**The member was not found in the voice channel.**`, ephemeral: true });
        };

        if (target.voice.channel !== member.voice.channel) {
            return interaction.reply({ content: '**You must be in the same voice channel!**', ephemeral: true })
        };

        if (target.permissions.has(PermissionFlagsBits.Administrator) || target.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({ content: `**You cannot kick this member**`, ephemeral: true })
        };

        if (member.voice.channel.members.size == 2) {
            return interaction.reply({ content: `**You cannot vote in a channel with only 2 members.**`, ephemeral: true })
        };

        const users = member.voice.channel.members.size;
        const channel = member.voice.channel;
        const votesNeed = Math.round((users - 1) * 0.5 + 1);

        let memberMention = "";

        channel.members.each((user) => {
            if (user.id == target.id) {
                return;
            } else {
                memberMention += `<@${user.id}> `
            }
        });

        const message = await interaction.reply({
            content: memberMention,
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Yellow)
                    .setThumbnail(target.displayAvatarURL())
                    .setAuthor({
                        name: member.user.username,
                        iconURL: member.user.displayAvatarURL()
                    })
                    .setDescription(
                        `**Started voting to kick <@${target.id}> out**\n\n`
                        + `**Time to vote:** _1 minutes..._\n`
                        + `**Needed votes**: _${votesNeed}_`
                    )
            ],
            fetchReply: true
        });

        const filterReactions = (reaction) => ['👍'].includes(reaction.emoji.name);

        message.react('👍');

        message.awaitReactions({ filterReactions, maxUsers: users , time: 1000 * 60 * 1 })
            .then(collected => {
                if (collected.get('👍').count > votesNeed) {
                    message.reactions.removeAll();

                    try {
                        target.voice.disconnect()
                    } catch { };

                    message.edit({
                        content: ' ',
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Green)
                                .setThumbnail(target.displayAvatarURL())
                                .setDescription(
                                    `**Voting is over - <@${target.id}> Has been kicked out.**\n\n`
                                    + `**He has been banned from the channel** ${channel.name}\n\n`
                                    + `**Votes collected**: ${(collected.get('👍').count) - 1}`
                                )
                                .setTimestamp()
                        ]
                    }).then(channel.permissionOverwrites.edit(target, { Connect: false }))
                };

                if (collected.get('👍').count <= votesNeed) {
                    message.reactions.removeAll()
                    return message.edit({
                        content: ' ',
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Red)
                                .setThumbnail(target.displayAvatarURL())
                                .setDescription(
                                    `**Voting is over - <@${target.id}> is not kicked out**.\n\n`
                                    + `**Need votes**: ${votesNeed}\n`
                                    + `**Votes collected**: ${(collected.get('👍').count - 1)}`
                                )
                                .setTimestamp()
                        ]
                    });
                }
            })
    }
}