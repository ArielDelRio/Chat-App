import React from "react";
import GoogleLogin from "react-google-login";
import { GoogleLogout } from "react-google-login";

export const Login = ({ handleLogin, handleErrorOnAuth, isSignedIn }) => {
  return (
    <GoogleLogin
      clientId="325689536941-3epu1qj2a2tkhb73v1g5bgh58dhtjckj.apps.googleusercontent.com"
      // render={renderProps => (
      //     <button onClick={renderProps.onClick} disabled={renderProps.disabled}>This is my custom Google button</button>
      //   )}
      isSignedIn={isSignedIn}
      onSuccess={(response) => handleLogin(response)}
      onFailure={(response) => handleErrorOnAuth(response)}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export const Logout = ({ handleLogout, handleErrorOnAuth, render }) => (
  <GoogleLogout
    clientId="325689536941-3epu1qj2a2tkhb73v1g5bgh58dhtjckj.apps.googleusercontent.com"
    buttonText="Logout"
    render={render}
    onLogoutSuccess={(response) => handleLogout(response)}
    onFailure={(response) => handleErrorOnAuth(response)}
  ></GoogleLogout>
);
