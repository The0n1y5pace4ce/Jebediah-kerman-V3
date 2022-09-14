const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js')
const { Guilds, GuildMembers, GuildMessages, GuildVoiceStates, MessageContent } = GatewayIntentBits
const { User, Message, GuildMember, ThreadMember} = Partials
const fs = require('fs')
const  { token } = require('./config.json')
const Deezer = require("erela.js-deezer");
const Apple = require("better-erela.js-apple").default;
const Spotify = require("better-erela.js-spotify").default;
const { Manager } = require("erela.js");

const { loadEvents } = require('./Handlers/eventHandler')
const { loadButtons } = require('./Handlers/buttonHandler')
const { loadErela } = require('./Handlers/erela')
const { antiCrash } = require('./Handlers/AntiCrash')


const client = new Client({ intents: [Guilds, GuildMembers, GuildMessages, GuildVoiceStates, MessageContent], partials: [User, Message, GuildMember, ThreadMember] }) 

client.config = require("./config.json");
client.buttons = new Collection();
client.commands = new Collection();
client.events = new Collection();
client.tools = require('./Utils/Tools');

loadEvents(client);
loadButtons(client);
loadErela(client);
antiCrash(client)


client.manager = new Manager({
  nodes: client.config.nodes,
  plugins: [
    new Spotify({
      clientID: client.config.spotifyClientID,
      clientSecret: client.config.spotifySecret,
    }),
    new Apple(),
    new Deezer(),
  ],
  send: (id, payload) => {
    let guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
});

module.exports = client;

client
    .login(token)
    .catch((err) => console.log(err))
