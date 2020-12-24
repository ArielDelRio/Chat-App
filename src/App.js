import React, { Component } from "react";
import Pusher from "pusher-js";

import UsernameForm from "./components/UsernameForm.component";
import ChatScreen from "./components/ChatScreen.component";

const SCREENS = {
  LOGIN: "LoginScreen",
  CHAT: "ChatScreen",
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentScreen: "LoginScreen",
      currentusername: "",
      channel: null,
      loading: false,
      errorMsg: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // const pusher = new Pusher("73921353a707b3172863");
    // console.log(pusher.connection.state);
    // const userAuthenticated = localStorage.getItem("AUTH");
    // if (userAuthenticated) {
    //   const pusher = new Pusher("73921353a707b3172863", {
    //     cluster: "us2",
    //     authEndpoint: "http://localhost:3001/pusher/auth",
    //     auth: { params: { username: userAuthenticated } },
    //   });
    //   pusher.subscribe("presence-main");
    // }
  }

  //subscribe user
  async handleSubmit(username) {
    const pusher = new Pusher("73921353a707b3172863", {
      cluster: "us2",
      authEndpoint: "http://localhost:3001/pusher/auth",
      auth: { params: { username: username } },
    });

    const channel = pusher.subscribe("presence-main");

    this.setState({ loading: true });
    channel.bind("pusher:subscription_succeeded", (data) => {
      // localStorage.setItem()
      this.setState({
        currentusername: username,
        currentScreen: SCREENS.CHAT,
        channel: channel,
        loading: false,
        errorMsg: "",
      });
    });

    channel.bind("pusher:subscription_error", () => {
      this.setState({
        currentusername: username,
        currentScreen: SCREENS.LOGIN,
        loading: false,
        errorMsg: "Error on subscription",
      });
    });
  }

  renderLoginScreen() {
    return this.state.loading ? (
      "Loading..."
    ) : (
      <div>
        <UsernameForm onSubmit={(username) => this.handleSubmit(username)} />
        {this.state.currentusername && (
          <div>Hello {this.state.currentusername} </div>
        )}
      </div>
    );
  }

  render() {
    if (this.state.currentScreen === SCREENS.LOGIN)
      return this.renderLoginScreen();
    else if (this.state.currentScreen === SCREENS.CHAT) {
      return <ChatScreen channel={this.state.channel} />;
    }
  }
}

export default App;
