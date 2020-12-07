const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
    },
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;