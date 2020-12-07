const router = require("express").Router();
const Message = require("../models/Message");
const User = require("../models/User");
const { nanoid } = require('nanoid');

const activeConnections = {};

router.ws("/", async (ws, req) => {
    const id = nanoid();
    console.log("Client connected! id = " + id);
    activeConnections[id] = ws;

    const token = req.query.token;
    const user = await User.findOne({ token });

    if (!user) {
        return res.status(401).send({ error: "Wrong token" });
    } else {
        ws.on("message", async msg => {
            const decodedMessage = JSON.parse(msg);
            switch (decodedMessage.type) {
                case "GET_ALL_MESSAGES":
                    const messages = await Message.find().limit(30);
                    ws.send(JSON.stringify({ type: "ALL_MESSAGES", messages }));
                    break;
                case "CREATE_MESSAGE":
                    Object.keys(activeConnections).forEach(async connId => {
                        const conn = activeConnections[connId];
                        const message = new Message({
                            username: user.username,
                            text: decodedMessage.text,
                            token
                        });
                        await message.save();
                        conn.send(JSON.stringify({
                            type: "NEW_MESSAGE",
                            message,
                        }));
                    });
                    break;
                default:
                    console.log("Unknown message type:", decodedMessage.type);
            }
        });
    }

    ws.on("close", msg => {
        console.log("Client disconnected! id =", id);
        delete activeConnections[id];
    });
});

module.exports = router;