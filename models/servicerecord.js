const mongoose = require("mongoose");

const serviceRecord = new mongoose.Schema({
    userID: Object,
    date: Date,
    category: String,
    description: String
});

module.exports = mongoose.model("Service", serviceRecord);