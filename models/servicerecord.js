const mongoose = require("mongoose");

const serviceRecord = new mongoose.Schema({
    userID: Object,
    date: Date,
    category: String,
    subCategory: String,
    item: String,
    granted: Boolean
});

module.exports = mongoose.model("Service", serviceRecord);