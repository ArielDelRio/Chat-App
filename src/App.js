import React, { Component } from "react";
import Pusher from "pusher-js";

import { TOKEN_SIGNED_IN } from "./config";

import { Login } from "./components/GoogleAuth.component";

import ChatScreen from "./pages/ChatScreen/ChatScreen.page";

import LoginForm from "./pages/LoginForm/LoginForm.page";

const DOMAIN = {
  local: "http://localhost:3001",
  ip: "http://192.168.42.54:3001",
};

const PUSHER_CONFIG = {
  public_key: "664c0cde38c2cec0cdc9",
  cluster: "us2",
  authEndpoint: `${DOMAIN.local}/pusher/auth`,
  main_channel: "presence-main",
};

const TITLE = "Chat-App";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      user: null,
      channel: null,
      privateChannels: [],
      loading: false,
      errorMsg: "",
      isSignedIn: JSON.parse(localStorage.getItem(TOKEN_SIGNED_IN)) || false,
    };
  }

  subscription_succeeded(channel, profileObj) {
    this.setState({
      channel: channel,
      loading: false,
      errorMsg: "",
      login: true,
      user: profileObj,
    });
  }

  subscription_error(error) {
    console.log(error);
    this.setState({
      loading: false,
      errorMsg: "Error on subscription",
    });
  }

  handleLogin(response) {
    const profileObj = response.profileObj;
    localStorage.setItem(
      TOKEN_SIGNED_IN,
      JSON.stringify(this.state.isSignedIn)
    );

    this.pusher = new Pusher(PUSHER_CONFIG.public_key, {
      cluster: PUSHER_CONFIG.cluster,
      authEndpoint: PUSHER_CONFIG.authEndpoint,
      auth: {
        params: {
          user_id: profileObj.googleId,
          username: profileObj.name,
          givenName: profileObj.givenName,
          imageUrl: profileObj.imageUrl,
        },
      },
    });

    const channel = this.pusher.subscribe(PUSHER_CONFIG.main_channel);

    this.setState({ loading: true });

    channel.bind("pusher:subscription_succeeded", () =>
      this.subscription_succeeded(channel, profileObj)
    );

    channel.bind("pusher:subscription_error", (error) =>
      this.subscription_error(error)
    );

    channel.bind("client-accept-private-channels", (data) => {
      const myId = this.state.channel.members.me.id;

      const privateChannelName =
        data.user_id > myId
          ? `presence-${data.user_id}-${myId}`
          : `presence-${myId}-${data.user_id}`;

      this.subscribeToPrivateChannel(privateChannelName);
    });
  }

  handleLogout() {
    console.log("logout");
    localStorage.removeItem(TOKEN_SIGNED_IN);
    this.pusher.unsubscribe(PUSHER_CONFIG.main_channel);
    this.setState({
      login: false,
      user: null,
      channel: null,
    });
  }

  handleErrorOnAuth(response) {
    console.log(response);
    this.setState({
      login: false,
      user: null,
      errorMsg: `Error ${response.error}\n Details: ${response.detail}`,
    });
  }

  handleChangeIsSignedIn() {
    this.setState({ isSignedIn: !this.state.isSignedIn });
  }

  handleDrawerItemClick(itemData) {
    if (
      !itemData.user_id ||
      itemData.user_id === this.state.channel.members.me.id
    )
      return;

    //send invitation to join in a private chanel
    this.state.channel.trigger("client-accept-private-channels", {
      user_id: this.state.channel.members.me.id,
    });
    const myId = this.state.channel.members.me.id;

    const privateChannelName =
      myId > itemData.user_id
        ? `presence-${myId}-${itemData.user_id}`
        : `presence-${itemData.user_id}-${myId}`;

    this.subscribeToPrivateChannel(privateChannelName);
  }

  subscribeToPrivateChannel(privateChannelName) {
    const newPrivateChannel = this.pusher.subscribe(privateChannelName);

    newPrivateChannel.bind("pusher:subscription_succeeded", () => {
      this.setState({
        privateChannels: [...this.state.privateChannels, newPrivateChannel],
      });
    });

    newPrivateChannel.bind("pusher:subscription_error", (error) =>
      console.log(error)
    );
  }

  renderLoginScreen() {
    return this.state.loading ? (
      "...loading"
    ) : (
      <LoginForm handleChangeIsSignedIn={() => this.handleChangeIsSignedIn()}>
        <Login
          handleLogin={(response) => this.handleLogin(response)}
          handleErrorOnAuth={(response) => this.handleErrorOnAuth(response)}
          isSignedIn={this.state.isSignedIn}
        />
      </LoginForm>
    );
  }

  render() {
    return !this.state.login ? (
      this.renderLoginScreen()
    ) : (
      <ChatScreen
        channel={this.state.channel}
        title={TITLE}
        handleLogout={() => this.handleLogout()}
        handleDrawerItemClick={(e) => this.handleDrawerItemClick(e)}
        privateChannels={this.state.privateChannels}
      ></ChatScreen>
    );
  }
}

export default App;
