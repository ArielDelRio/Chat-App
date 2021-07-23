import React, { createContext, useState } from "react";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

export const themes = {
  dark: createTheme({
    palette: {
      type: "dark",
    },
  }),
  light: createTheme({
    palette: {
      type: "light",
    },
  }),
};

export const CustomThemeContext = createContext({
  theme: themes.light,
  setTheme: null,
});

const CustomThemeProvider = (props) => {
  const { children } = props;

  // const currentTheme = themes[localStorage.getItem("appTheme") || "dark"];
  const [theme, _setThemeName] = useState(themes.light);

  // const setThemeName = (name) => {
  //   // localStorage.setItem("appTheme", name);
  //   console.log(name);
  //   if (name === "dark") _setThemeName(themes.dark);
  //   if (name === "light") _setThemeName(themes.light);
  // };

  const contextValue = {
    currentTheme: theme,
    setTheme: _setThemeName,
  };

  return (
    <CustomThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CustomThemeContext.Provider>
  );
};

export default CustomThemeProvider;
