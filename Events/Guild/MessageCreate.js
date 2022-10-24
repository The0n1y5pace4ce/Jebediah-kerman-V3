const {GuildMember, Embed, InteractionCollector, Client, EmbedBuilder } = require("discord.js");
const Schema = require("../../Structures/schemas/Chatbot"); 
const axios = require("axios")
const { bshopKey } = require('../../Structures/config.json')
module.exports = {
    name: "messageCreate",
/**
 * 
 * @param {Client} client 
 */
async execute(message, client) {
    
   const data = Schema.findOne({Guild: message.guild.id}, async (err, data) => {
       
        if (!data) return message.author.send("enable chatbot")
        if (message.channel.id !== data.Channel) return;
        let channel = data.Channel;

        const chatbot = message.guild.channels.cache.get(data.Channel)
        if(!chatbot) {
            return;
        } else {
        }
try {
        if (!message.guild) return;
        if(message.author.id === client.user.id) return;
    const res = await axios.get(`${bshopKey}=1&msg=${encodeURIComponent(message.content)}`)
await chatbot.send({ content: `<@${message.author.id}> ${res.data.cnt}` })
} catch (err) {
    console.log(err)
}
  
        
    })
  }
}