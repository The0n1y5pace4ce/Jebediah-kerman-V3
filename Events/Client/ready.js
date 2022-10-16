const { database } = require("../../Structures/config.json");
const { Client } = require("discord.js");
const { mongoose } = require('mongoose')
const { magenta, yellow, green , white} = require("chalk")
const { loadCommands } = require('../../Structures/Handlers/commandHandler')
const { Node } = require('shoukaku')

module.exports = {
  name: "ready",
  once: true,
  /**
   *
   * @param {Client} client
   * @param {Node} Node
   */
  async execute(client, node) {
    console.log(yellow(`---------------------------------------------------------`))
    console.log(" ")
    console.log(`Client is now logged in as ${client.user.username}`);
    console.log(" ")
    console.log(yellow(`---------------------------------------------------------`))

    loadCommands(client)

    if (!database) return;
    mongoose
      .connect(database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log(yellow(`✅ >>> Successfully connected to MongoDB!`));
      })
      .catch((err) => {
        console.log(err);
      });

      console.log(
        magenta("[") +
          magenta("Shoukaku") +
          magenta("]") +
          green(" Node ") +
          white(node.name) +
          green(" connected!")
      );
  },
};
