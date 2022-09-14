const { database } = require("../../config.json");
const { Client } = require("discord.js");
const { mongoose } = require('mongoose')
const chalk = require("chalk")
const { loadCommands } = require('../../Handlers/commandHandler')

module.exports = {
  name: "ready",
  once: true,
  /**
   *
   * @param {Client} client
   */
  async execute(client) {
    console.log(chalk.yellow(`---------------------------------------------------------`))
    console.log(" ")
    console.log(`Client is now logged in as ${client.user.username}`);
    console.log(" ")
    console.log(chalk.yellow(`---------------------------------------------------------`))

    loadCommands(client)

    client.manager.init(client.user.id)

    if (!database) return;
    mongoose
      .connect(database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log(chalk.yellow(`✅ >>> Successfully connected to MongoDB!`));
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
