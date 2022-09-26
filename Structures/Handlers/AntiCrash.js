const { EmbedBuilder, WebhookClient } = require("discord.js");
const { inspect } = require("util");
const { WebhookURL } = require('../config.json');
const webhook = new WebhookClient({
    url: WebhookURL,
});
const { magenta, yellow } = require('chalk');

async function antiCrash(client) {
    const embed = new EmbedBuilder()
        .setColor("Red");

    console.log(magenta('[Anticrash] »'), yellow('Connected Successfully'))
    
    client.on("error", (err) => {
        console.log(err);

        embed
            .setTitle("Discord API Error")
            .setURL("https://discordjs.guide/popular-topics/errors.html#api-errors")
            .setDescription(`\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``)
            .setTimestamp();

        return webhook.send({ embeds: [embed] });
    });

    process.on("unhandledRejection", (reason, promise) => {
        console.log(reason, "\n", promise);

        embed
            .setTitle("<:error:1019744274612502569> | Unhandled Rejection/Catch")
            .setURL("https://nodejs.org/api/process.html#event-unhandledrejection")
            .addFields(
                { name: "Reason", value: `\`\`\`${inspect(reason, { depth: 0 }).slice(0, 1000)}\`\`\`` },
                { name: "Promise", value: `\`\`\`${inspect(promise, { depth: 0 }).slice(0, 1000)}\`\`\`` }
            )
            .setTimestamp();

        return webhook.send({ embeds: [embed] });
    });
    
    process.on("uncaughtException", (err, origin) => {
        console.log(err, "\n", origin);

        embed
            .setTitle("<:error:1019744274612502569> | Uncaught Exception/Catch")
            .setURL("https://nodejs.org/api/process.html#event-uncaughtexception")
            .addFields(
                { name: "Error", value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\`` },
                { name: "Origin", value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\`` }
            )
            .setTimestamp();

        return webhook.send({ embeds: [embed] });
    });
    
    process.on("uncaughtExceptionMonitor", (err, origin) => {
        console.log(err, "\n", origin);

        embed
            .setTitle("<:error:1019744274612502569> | Uncaught Exception Monitor")
            .setURL("https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor")
            .addFields(
                { name: "Error", value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\`` },
                { name: "Origin", value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\`` }
            )
            .setTimestamp();
    
        return webhook.send({ embeds: [embed] });
    });
    
    process.on("warning", (warn) => {
        console.log(warn);

        embed
            .setTitle("<:error:1019744274612502569> | Uncaught Exception Monitor Warning")
            .setURL("https://nodejs.org/api/process.html#event-warning")
            .addFields(
                { name: "Warning", value: `\`\`\`${inspect(warn, { depth: 0 }).slice(0, 1000)}\`\`\`` }
            )
            .setTimestamp();

        return webhook.send({ embeds: [embed] });
    });

}

module.exports = { antiCrash }