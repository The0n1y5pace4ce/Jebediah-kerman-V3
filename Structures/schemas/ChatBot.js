const {model, Schema} = require('mongoose');

let AI = new Schema({
    Guild: String,
    Channel: String,
});

module.exports = model("AI", AI);