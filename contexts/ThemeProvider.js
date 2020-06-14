import React, { createContext, useState, useEffect, useReducer, useMemo } from "react";
import AsyncStorage from '@react-native-community/async-storage'

const ThemeContext = createContext();
const { Provider } = ThemeContext;

const ThemeProvider = props => {

  const [theme, setTheme] = useState({ 
    name: "ScreamOfTomato", 
    backgroundColor: "aliceblue",
    textColor: "#666",
    textBackgroundColor: "aliceblue",
    activeTintColor: "tomato",
    inactiveTintColor: "gray",
    inactiveBackgroundColor: 'lightgray',
    iconColor: "#666",
    headerBackgroundColor: "white",
    headerTintColor: "gray",
    bannerFontFamily: "Lobster-Regular",
    borderColor: "#ccc",
    sectionBackgroundColor: "lightblue",
    rowColor: "#666",
    rowBackgroundColor: "aliceblue",
    selectedColor: "tomato",
    selectedBackgroundColor: "antiquewhite",
    menuListIconColor: "#999",
  });

  useEffect(() => {

  }, []);

  const context = { theme, setTheme }

  return <Provider value={ context }>{props.children}</Provider>;
};

export { ThemeProvider, ThemeContext };
