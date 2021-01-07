import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "64ch",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
}));

const UsersList = ({ listItems, handleItemClick }) => {
  const classes = useStyles();
  return (
    <List className={classes.root}>
      {listItems.map((user) => {
        return (
          <div key={user.id} onClick={handleItemClick}>
            <ListItem alignItems="flex-start" button>
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={user.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={user.name}
                secondary={<React.Fragment>{user.lastMessage}</React.Fragment>}
              />
            </ListItem>
            <Divider component="li" />
          </div>
        );
      })}
    </List>
  );
};

export default UsersList;
