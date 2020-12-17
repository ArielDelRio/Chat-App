import React, { Component } from "react";
import UsernameForm from "./components/UsernameForm.component";
import Pusher from "pusher-js";
import Axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const pusher = new Pusher("73921353a707b3172863", {
      cluster: "us2",
      encrypted: true,
    });
    const channel = pusher.subscribe("chat");
    channel.bind("message", (data) => {
      console.log(data);
    });
  }

  async handleSubmit(username) {
    try {
      const res = await Axios.post("http://localhost:3001/message", {
        username: username,
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <UsernameForm onSubmit={(username) => this.handleSubmit(username)} />
    );
  }
}

export default App;
