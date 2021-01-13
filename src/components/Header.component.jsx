import React from "react";
import clsx from "clsx";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import { makeStyles } from "@material-ui/core/styles";
import { Logout } from "../components/GoogleAuth.component";
import ExitToApp from "@material-ui/icons/ExitToApp";

import Drawer from "./Drawer.component";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },

  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },

  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
}));

const Header = ({
  title,
  drawerItems,
  isDrawerOpen,
  handleLogout,
  handleDrawerItemClick,
  handleDrawerToggle,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: isDrawerOpen,
        })}
      >
        <Toolbar>
          <IconButton
            onClick={handleDrawerToggle}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          <Logout
            handleLogout={handleLogout}
            render={(renderProps) => (
              <Button
                onClick={renderProps.onClick}
                variant="outlined"
                color="inherit"
                endIcon={<ExitToApp />}
              >
                Logout
              </Button>
            )}
          />
        </Toolbar>
      </AppBar>
      <div className={classes.drawerHeader}></div>

      <Drawer
        isDrawerOpen={isDrawerOpen}
        handleDrawerToggle={(event) => handleDrawerToggle(event)}
        listItems={drawerItems}
        handleDrawerItemClick={handleDrawerItemClick}
      />
    </div>
  );
};

export default Header;
