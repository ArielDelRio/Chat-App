import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  snackbar: {
    top: "4.5em",
    // backgroundColor: theme.palette.success.main,
  },
}));

export default function Info({ message, open, setOpenInfo }) {
  const classes = useStyles();

  return (
    <div>
      <Snackbar
        className={classes.snackbar}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        autoHideDuration={3000}
        onClose={() => setOpenInfo(false)}
        open={open}
        message={message}
      ></Snackbar>
    </div>
  );
}
