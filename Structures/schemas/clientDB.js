"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var Schema = mongoose_1["default"].Schema, model = mongoose_1["default"].model;
exports["default"] = model('ClientDB', new Schema({
    Client: Boolean,
    Memory: Array
}));
