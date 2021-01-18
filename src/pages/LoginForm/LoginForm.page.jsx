import React from "react";

import {
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Card,
  CardMedia,
} from "@material-ui/core";

import useStyles from "./LoginForm.style";

const LoginForm = ({ children, isSignedIn, handleChangeIsSignedIn }) => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <Container component="main" maxWidth="xs" className={classes.root}>
        <Card variant="elevation" className={classes.card}>
          <CardMedia
            className={classes.media}
            component="img"
            alt="Chat-App Logo"
            // height="200"
            // width="200"
            image="logo2.png"
            title="Chat-App"
          />
          <Divider />
          <div className={classes.submit}>{children}</div>
          <FormControlLabel
            onChange={() => handleChangeIsSignedIn()}
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
        </Card>
      </Container>
    </div>
  );
};

export default LoginForm;
