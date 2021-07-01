export const TOKEN_SIGNED_IN = "CHAT-APP-GOOGLE_PROVIDER_SIGNEDIN";

export const GOOGLE_CLIENT_ID =
  "325689536941-3epu1qj2a2tkhb73v1g5bgh58dhtjckj.apps.googleusercontent.com";

const dev = true;

export const PUSHER_CONFIG = {
  public_key: "664c0cde38c2cec0cdc9",
  cluster: "us2",
  authEndpoint: dev ? "http://localhost:3001/pusher/auth" : `./pusher/auth`,
  main_channel: "presence-main",
};
