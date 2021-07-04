import React from "react";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import { makeStyles } from "@material-ui/core";
import { STATUS } from "../utils";

const useStyles = makeStyles((theme) => ({
  icon: {
    fontSize: ".7em",
    verticalAlign: "middle",
  },
  time: {
    fontSize: ".6em",
    paddingRight: ".2em",
  },
}));

const InfoMessage = ({ status, isUserMsg, sendTime, recivedTime }) => {
  const classes = useStyles();
  if (isUserMsg) {
    return (
      <div>
        <span className={classes.time}>{sendTime}</span>
        {status === STATUS.SENDING && (
          <AccessTimeIcon color="disabled" className={classes.icon} />
        )}
        {status === STATUS.DELIVERED && (
          <DoneAllIcon color="disabled" className={classes.icon} />
        )}
        {status === STATUS.VIEWED && (
          <DoneAllIcon color="primary" className={classes.icon} />
        )}
      </div>
    );
  } else {
    return <span className={classes.time}>{recivedTime}</span>;
  }
};

export default InfoMessage;
