import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(16),
    textAlign: "center",
  },
  card: {
    padding: "2em",
    display: "flex",
    flexDirection: "column",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    alignSelf: "center",
  },
  submit: {
    width: "100%", // Fix IE 11 issue.
    margin: theme.spacing(3, 0, 2),
    // margin: theme.spacing(3, 0, 2),
  },
}));

export default useStyles;
