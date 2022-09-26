const client = require("../../Structures/index");

module.exports = {
  name: "raw",
  execute(data) {
    client.manager.updateVoiceState(data);
  },
};
