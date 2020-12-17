const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const {
  getChannels,
  send_message,
  getChannel,
  getUsersByChannel,
} = require("./controllers");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Routes
app.get("/channels", getChannels);

app.get("/channels:channel_name", getChannel);

app.get("/users:channel_name", getUsersByChannel);

app.post("/message", send_message);

// Live Server
const PORT = 3001;
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Running on port ${PORT}`);
  }
});
