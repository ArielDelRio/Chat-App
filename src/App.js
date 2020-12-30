import React, { Component } from "react";
import Pusher from "pusher-js";

import UsernameForm from "./components/UsernameForm.component";
import ChatScreen from "./components/ChatScreen.component";

const DOMAIN = {
  local: "http://localhost:3001",
  ip: "http://192.168.42.54:3001",
};
const SCREENS = {
  LOGIN: "LoginScreen",
  CHAT: "ChatScreen",
};

const PUSHER_CONFIG = {
  public_key: "3aa36f0535ce0a0c6f05",
  cluster: "us2",
  authEndpoint: `${DOMAIN.local}/pusher/auth`,
  main_channel: "presence-main",
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentScreen: "LoginScreen",
      channel: null,
      loading: false,
      errorMsg: "",
    };

    this.pusher = new Pusher(PUSHER_CONFIG.public_key, {
      cluster: PUSHER_CONFIG.cluster,
      authEndpoint: PUSHER_CONFIG.authEndpoint,
    });
  }

  subscription_succeeded(data, channel) {
    this.setState({
      currentScreen: SCREENS.CHAT,
      channel: channel,
      loading: false,
      errorMsg: "",
    });
  }

  subscription_error(error) {
    console.log(error);
    this.setState({
      currentScreen: SCREENS.LOGIN,
      loading: false,
      errorMsg: "Error on subscription",
    });
  }

  //subscribe user
  handleSubmit(username) {
    this.pusher.config.auth = { params: { username: username } };

    const channel = this.pusher.subscribe(PUSHER_CONFIG.main_channel);

    this.setState({ loading: true });

    channel.bind("pusher:subscription_succeeded", (data) =>
      this.subscription_succeeded(data, channel)
    );

    channel.bind("pusher:subscription_error", (error) =>
      this.subscription_error(error)
    );
  }

  handleLogout() {
    this.pusher.unsubscribe(PUSHER_CONFIG.main_channel);
    this.setState({ currentScreen: SCREENS.LOGIN, channel: null });
  }

  renderLoginScreen() {
    return this.state.loading ? (
      "Loading..."
    ) : (
      <div>
        {this.state.errorMsg ? (
          <div style={{ color: "red" }}>{this.state.errorMsg}</div>
        ) : (
          <UsernameForm onSubmit={(username) => this.handleSubmit(username)} />
        )}
      </div>
    );
  }

  render() {
    return this.state.currentScreen === SCREENS.LOGIN ? (
      this.renderLoginScreen()
    ) : (
      <div>
        <ChatScreen channel={this.state.channel} />
        <button onClick={() => this.handleLogout()}>Log out</button>
      </div>
    );
  }
}

export default App;
