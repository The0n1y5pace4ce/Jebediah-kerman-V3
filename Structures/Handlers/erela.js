async function loadErela(client) {
  const { magenta, green } = require("chalk");
  const { loadFiles } = require("../Functions/fileLoader");

  const files = await loadFiles("Events/erela");
  files.forEach((file) => {
    const event = require(file);
    const execute = (...args) => event.execute(...args, client);

    client.manager.on(event.name, execute);

    return console.log(
      magenta("[") +
        magenta("Erela") +
        magenta("]") +
        " Loaded " +
        green(`${event.name}.js`)
    );
  });
}

module.exports = { loadErela };
