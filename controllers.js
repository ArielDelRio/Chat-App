const Pusher = require("pusher");
const pusherConfig = require("./pusher.configuration");

const pusher = new Pusher({
  appId: pusherConfig.app_id,
  key: pusherConfig.key,
  secret: pusherConfig.secret,
  cluster: pusherConfig.cluster,
  useTLS: true,
});

// route: /channels
module.exports.getChannels = (req, res) => {
  const channels = get_channels();
  res.send(channels);
};

// route: /channels:channel_name
module.exports.getChannel = (req, res) => {
  const channel_name = res.query.channel_name;
  const channel = get_channel(channel_name);
  res.send(channel);
};

// route: /message
module.exports.send_message = (req, res) => {
  const payload = req.body;
  console.log("trying send ");
  const message = `Hello ${payload.username}`;
  pusher
    .trigger("chat", "message", {
      message: message,
    })
    .then((value) => {
      console.log(value);
    })
    .catch((error) => {
      console.log(error);
    });
  res.send(message);
};

// route: /users:channel_name
module.exports.getUsersByChannel = (req, res) => {
  const channel_name = res.query.channel_name;
  const users = get_users_by_channel(channel_name);
  res.send(users);
};

const get_channels = async () => {
  try {
    const res = await pusher.get({ path: "/channels" });
    if (res.status === 200) {
      const body = await res.json();
      const channelsInfo = body.channels;
    }
    return body;
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
    }
    return body;
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
    }
    return body;
  } catch (error) {
    console.log(error);
  }
};
