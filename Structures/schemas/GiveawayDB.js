const { model, Schema } = require("mongoose");

const schema = new Schema({
    GuildID: String,
    ChannelID: String,
    MessageID: String,
    Winners: Number,
    Prize: String,
    EndTime: String,
    Paused: Boolean,
    Ended: Boolean,
    HostedBy: String,
    Entered: [String]
})

module.exports = model("giveawaySchema", schema, "userGiveawaySchema");