const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.KEY,
  secret: process.env.SECRET,
  cluster: process.env.cluster,
  useTLS: true,
});

module.exports.authenticate = (req, res) => {
  console.log("authentication in progress..");
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const presenceData = {
    user_id: socketId,
    user_info: {
      user_id: socketId,
      name: req.body.username,
    },
  };

  const auth = pusher.authenticate(socketId, channel, presenceData);
  console.log(auth);
  res.send(auth);
};

// route: /channels
module.exports.getChannels = (req, res) => {
  console.log("get_channels");
  const channels = get_channels();
  res.send(channels);
};

// route: /channels:channel_name
module.exports.getChannel = (req, res) => {
  const channel_name = req.params.channel_name;
  const channel = get_channel(channel_name);
  res.send(channel);
};

// route: /message
module.exports.send_message = (req, res) => {
  const payload = req.body;
  console.log(payload);
  pusher
    .trigger("presence-main", "get-message", {
      senderId: payload.senderId,
      message: `Hello ${payload.text}`,
    })
    .then((value) => {
      console.log(value);
    })
    .catch((error) => {
      console.log(error);
    });
  res.status(200);
};

// route: /users:channel_name
module.exports.getUsersByChannel = (req, res) => {
  const channel_name = req.params.channel_name;
  console.log(channel_name);
  const users = get_users_by_channel(channel_name);
  res.send(users);
};

const get_channels = async () => {
  try {
    const res = await pusher.get({ path: "/channels" });
    if (res.status === 200) {
      const body = await res.json();
      const channelsInfo = body.channels;
      console.log(body);
      return body;
    }
  } catch (error) {
    console.log(error);
  }
};

const get_channel = async (channel_name) => {
  try {
    const res = await pusher.get({ path: `/channels/${channel_name}` });
    if (res.status === 200) {
      const body = await res.json();
      const channelInfo = body.channels;
      // console.log(body);
      return body;
    }
  } catch (error) {
    console.log(error);
  }
};

const get_users_by_channel = async (channel_name) => {
  try {
    const res = await pusher.get({
      path: `/channels/${channel_name}/users`,
    });

    if (res.status === 200) {
      const body = await res.json();
      const users = body.users;
      console.log(body);
      return users;
    }
  } catch (error) {
    console.log(`Error retriving users by chanel.`);
    console.log(error);
  }
};
