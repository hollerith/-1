import React, { createContext, useState, useEffect, useReducer, useMemo } from "react";
import AsyncStorage from '@react-native-community/async-storage'
import themes from "../utils/themes"

const ThemeContext = createContext();
const { Provider } = ThemeContext;

const ThemeProvider = props => {

  const defaultTheme = themes[0]
  const [theme, setTheme] = useState(defaultTheme)

  const changeTheme = async (name) => {
    setTheme(themes.filter(item => item.name == name)[0])
    await AsyncStorage.setItem("@wzpr:Theme", name)
  }

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let currentTheme
      try {
        currentTheme = await AsyncStorage.getItem("@wzpr:Theme")
        if (currentTheme) {
          setTheme(themes.filter(item => item.name == currentTheme)[0])
        } else {
          currentTheme = 'ScreamOfTomato'
          await AsyncStorage.setItem("@wzpr:Theme", currentTheme);
        }
      } catch (e) {
        currentTheme = themes[0].name
        await AsyncStorage.setItem("@wzpr:Theme", currentTheme);
      }
    }

    bootstrapAsync()
  }, []);

  const context = { theme, setTheme, changeTheme }

  return <Provider value={ context }>{props.children}</Provider>;
};

export { ThemeProvider, ThemeContext };
