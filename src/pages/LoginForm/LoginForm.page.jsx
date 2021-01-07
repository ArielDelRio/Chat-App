import React from "react";

import {
  Avatar,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Typography,
  Card,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import useStyles from "./LoginForm.style";

const LoginForm = ({ children, isSignedIn, handleChangeIsSignedIn }) => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs" className={classes.root}>
      <Card variant="outlined" className={classes.card}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h4">
          Chat App
        </Typography>
        <Divider />
        <div className={classes.submit}>{children}</div>
        <FormControlLabel
          onChange={() => handleChangeIsSignedIn()}
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
      </Card>
    </Container>
  );
};

export default LoginForm;
