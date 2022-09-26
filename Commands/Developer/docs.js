const { SlashCommandBuilder, ChatInputCommandInteraction, CommandInteraction, PermissionFlagsBits } = require('discord.js')
const Docs = require('discord.js-docs')
const branch = 'stable'
const max = 1024

const replaceDisco = (str) => 
    str
        .replace(/docs\/docs/g, `docs/discord.js/${branch}`)

module.exports = {
    data: new SlashCommandBuilder()
    .setName('docs')
    .setDescription('Search the discord.js docs!')
    .addStringOption(
        (option) => 
            option.setName('query')
                .setDescription('Query for the docs search')
                .setRequired(true)
    ),
    developer: true,
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const query = interaction.options.getString('query')
        const doc = await Docs.fetch(branch)
        const results = await doc.resolveEmbed(query)

        if(!results) {
            return interaction.reply({content: 'ERROR: COULD NOT FIND THAT DOCUMENTATION'})
        }

        const string = replaceDisco(JSON.stringify(results))

        const embed = JSON.parse(string)

        const extra =
        '\n\nView more here: ' +
        /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
            .exec(embed.description)[0]
            .split(')')[0]

        for (const field of embed.fields || []) {
            if(field.value.length >= max) {
                field.value = field.value.slice(0, max)
                const split = field.value.split(' ')
                let joined = split.join(' ')

                while (joined.length >= max - extra.length) {
                    split.pop()
                    joined = split.join(' ')
                }
                field.value = joined + extra
            }
        }

        if(
            embed.fields &&
            embed.fields[embed.fields.length - 1].value.startsWith('[View source]')
        ) {
            embed.fields.pop()
        } {
            return interaction.reply({embeds: [embed]})
        }
    }
}
