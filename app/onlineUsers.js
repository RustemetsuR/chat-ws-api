const router = require("express").Router();
const OnlineUser = require("../models/OnlineUser");
const User = require("../models/User");

router.get("/", async (req, res) => {
    try {
        const users = await OnlineUser.find();
        res.send(users);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.post("/", async (req, res) => {
    const token = req.get("Authorization");
    if (!token) {
        return res.status(401).send({ error: "No token presented" });
    }
    const user = await User.findOne({ token });

    if (!user) {
        return res.status(401).send({ error: "Wrong token" });
    }

   const username = user.username;
    try {
        const user = new OnlineUser({
            username,
            token,
        });
        await user.save();
        res.send(user);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.delete("/", async (req, res) => {
    const token = req.get("Authorization");
    if (!token) {
        return res.status(401).send({ error: "No token presented" });
    }
    const user = await User.findOne({ token });

    if (!user) {
        return res.status(401).send({ error: "Wrong token" });
    }

    const onlineUser = OnlineUser.find({username: user.username});

    try {
        await onlineUser.remove();
        res.send({message: 'Success'});
    } catch (e) {
        res.sendStatus(500);
    }
});

module.exports = router;