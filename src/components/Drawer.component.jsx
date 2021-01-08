import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";

import UsersList from "./UsersList.component";
import { useMediaQuery } from "@material-ui/core";

const useStyles = makeStyles((theme) => {
  return {
    list: {
      width: 250,
      [theme.breakpoints.down("xs")]: {
        width: "100vw",
      },
    },
  };
});

const TemporaryDrawer = ({
  listItems,
  isDrawerOpen,
  handleDrawerToggle,
  handleDrawerItemClick,
}) => {
  const classes = useStyles();

  const smScreen = useMediaQuery("(max-width:600px)");

  return (
    <div>
      <React.Fragment>
        <Drawer
          open={isDrawerOpen}
          onClose={handleDrawerToggle}
          variant="persistent"
        >
          <div
            className={classes.list}
            role="presentation"
            onClick={smScreen ? handleDrawerToggle : null}
            onKeyDown={smScreen ? handleDrawerToggle : null}
          >
            <UsersList
              listItems={listItems}
              handleItemClick={handleDrawerItemClick}
            />
          </div>
        </Drawer>
      </React.Fragment>
    </div>
  );
};

export default TemporaryDrawer;
