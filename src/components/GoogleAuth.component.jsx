import React from "react";
import { GOOGLE_CLIENT_ID } from '../config';
import { GoogleLogin, GoogleLogout  } from "react-google-login";

export const Login = ({ handleLogin, handleErrorOnAuth, isSignedIn }) => {
  return (
    <GoogleLogin
      clientId = { GOOGLE_CLIENT_ID }
      isSignedIn={isSignedIn}
      onSuccess={(response) => handleLogin(response)}
      onFailure={(response) => handleErrorOnAuth(response)}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export const Logout = ({ handleLogout, handleErrorOnAuth, render }) => (
  <GoogleLogout
    clientId= { GOOGLE_CLIENT_ID }
    buttonText="Logout"
    render={render}
    onLogoutSuccess={(response) => handleLogout(response)}
    onFailure={(response) => handleErrorOnAuth(response)}
  ></GoogleLogout>
);
