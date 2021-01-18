require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const {
  getChannels,
  send_message,
  getChannel,
  getUsersByChannel,
  authenticate,
  test,
} = require("./controllers");

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(cors());

//Routes
app.post("/pusher/auth", authenticate);

app.get("/channels/:channel_name", getChannel);

app.get("/channels/:channel_name/users", getUsersByChannel);

app.post("/send-message", send_message);

app.get("/channels/", getChannels);

app.get("/test", test);

app.use(express.static('build'));
// Live Server
const PORT = 3000;
app.listen(process.env.PORT || PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Running on port ${PORT}`);
  }
});
