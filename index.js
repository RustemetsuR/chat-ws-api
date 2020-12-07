const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
require("express-ws")(app);


const users = require("./app/users");
const chat = require("./app/chat");
const onlineUsers = require("./app/onlineUsers");
const config = require("./config");
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const run = async () => {
  await mongoose.connect(config.db.url + "/" + config.db.name, {useNewUrlParser: true, autoIndex: true, useUnifiedTopology: true});

  app.use("/users", users);
  app.use("/chatroom", chat);
  app.use("/onlineUsers", onlineUsers)

  console.log("Connected to mongo DB");

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
};

run().catch(console.log);

