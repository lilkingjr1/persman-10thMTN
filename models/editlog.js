const mongoose = require("mongoose");

const editLog = new mongoose.Schema({
    editor: String,
    editorID: Object,
    editedUser: String,
    editedUserID: Object,
    editDate: Date,
    editType: String
});

module.exports = mongoose.model("Edit", editLog);