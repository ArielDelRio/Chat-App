import React, { Component } from "react";
import Pusher from "pusher-js";

import { TOKEN_SIGNED_IN } from "./config";

import { Login } from "./components/GoogleAuth.component";

import ChatScreen from "./pages/ChatScreen/ChatScreen.page";
import Header from "./components/Header.component";

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

const offlineData = {
  state: {
    login: false,
    user: {
      name: "Ariel Del Rio",
      email: "arieldelrioviamonte@gmail.com",
      familyName: "Del Rio",
      givenName: "Ariel",
      googleId: "116207138867903259920",
      imageUrl:
        "https://lh5.googleusercontent.com/-dMMmSPO_gCc/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmcrcnRSQN8PMvpaW563QECGdj2EA/s96-c/photo.jpg",
    },
  },
};

const users = [
  {
    id: 0,
    avatar: "/static/images/avatar/1.jpg",
    name: "Main Channel",
    lastMessage: "Welcome..",
    type: "channel",
  },
  {
    id: 1,
    avatar: "/static/images/avatar/1.jpg",
    name: "Ariel",
    lastMessage: " I'll be in your neighborhood doing errands this…",
  },
  {
    id: 2,
    avatar: "/static/images/avatar/2.jpg",
    name: "Arelys",
    lastMessage: " Wish I could come, but I'm out of town this…",
  },
  {
    id: 3,
    avatar: "/static/images/avatar/3.jpg",
    name: "Anabel",
    lastMessage: " Do you have Paris recommendations? Have you ever…",
  },
];

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

  handleDrawerItemClick() {
    console.log("User click");
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
    console.log(this.state.isSignedIn);
    return !this.state.login ? (
      this.renderLoginScreen()
    ) : (
      <ChatScreen channel={this.state.channel}>
        <Header
          title={TITLE}
          handleLogout={() => this.handleLogout()}
          drawerItems={users}
          handleDrawerItemClick={() => this.handleDrawerItemClick()}
        />
      </ChatScreen>
    );
  }
}

export default App;
