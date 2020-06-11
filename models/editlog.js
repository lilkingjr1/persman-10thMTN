const mongoose = require("mongoose");

const editLog = new mongoose.Schema({
    editor: String,
    editorID: Object,
    editedUser: String,
    editedUserID: Object,
    editDate: Date,
    editDescription: String
});

module.exports = mongoose.model("Edit", editLog);