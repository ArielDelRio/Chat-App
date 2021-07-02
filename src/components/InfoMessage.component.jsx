import React from "react";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import DoneIcon from "@material-ui/icons/Done";
import DoneAllIcon from "@material-ui/icons/DoneAll";

const InfoMessage = ({ status }) => {
  if (status === "SENDING")
    return <AccessTimeIcon color="disabled" style={{ fontSize: ".7em" }} />;
  else if (status === "DELIVERED")
    return <DoneAllIcon color="disabled" style={{ fontSize: ".7em" }} />;
  else if (status === "VIEWED")
    return <DoneAllIcon color="primary" style={{ fontSize: ".7em" }} />;
};

export default InfoMessage;
