import React, { Component } from "react";
import Pusher from "pusher-js";

import { TOKEN_SIGNED_IN } from "./config";

import { Login } from "./components/GoogleAuth.component";

import ChatScreen from "./pages/ChatScreen/ChatScreen.page";

import LoginForm from "./pages/LoginForm/LoginForm.page";
import { LinearProgress } from "@material-ui/core";

import { DOMAIN } from './config';

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
  }

  handleLogout() {
    localStorage.removeItem(TOKEN_SIGNED_IN);
    this.pusher.unsubscribe(PUSHER_CONFIG.main_channel);
    this.setState({
      login: false,
      user: null,
      channel: null,
    });
  }

  handleErrorOnAuth(response) {
    this.setState({
      login: false,
      user: null,
      errorMsg: `Error ${response.error}\n Details: ${response.detail}`,
    });
  }

  handleChangeIsSignedIn() {
    this.setState({ isSignedIn: !this.state.isSignedIn });
  }

  renderLoginScreen() {
    return (
      <LoginForm handleChangeIsSignedIn={() => this.handleChangeIsSignedIn()}>
        <Login
          handleLogin={(response) => this.handleLogin(response)}
          handleErrorOnAuth={(response) => this.handleErrorOnAuth(response)}
          isSignedIn={this.state.isSignedIn}
        />
        {this.state.loading ? <LinearProgress /> : null}
      </LoginForm>
    )
  }

  render() {
    return !this.state.login ? (
      this.renderLoginScreen()
    ) : (
        <ChatScreen
          pusher={this.pusher}
          channel={this.state.channel}
          title={TITLE}
          handleLogout={() => this.handleLogout()}
          privateChannels={this.state.privateChannels}
        ></ChatScreen>
      );
  }
}

export default App;
