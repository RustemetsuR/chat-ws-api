const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OnlineUserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true
    },
});

const OnlineUser = mongoose.model("OnlineUser", OnlineUserSchema);

module.exports = OnlineUser;