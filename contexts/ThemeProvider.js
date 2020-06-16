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
    await AsyncStorage.setItem("Theme", name)
  }

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      console.log('\x1b[33m Booting::\x1b[35mTheme Context\x1b[0m')
      let currentTheme
      try {
        currentTheme = await AsyncStorage.getItem("Theme")
        console.log(`\x1b[33m Hydrating::\x1b[32m theme ${currentTheme}\x1b[0m`)
        if (currentTheme) {
          console.log(`\x1b[33m Booting::\x1b[35m Loading ${currentTheme} Theme\x1b[0m`)
          setTheme(themes.filter(item => item.name == currentTheme)[0])
        } else {
          console.log(`\x1b[33m Booting::\x1b[35m Using default ${theme.name} Theme\x1b[0m`) 
          currentTheme = 'ScreamOfTomato'
          await AsyncStorage.setItem("Theme", currentTheme);
        }
      } catch (e) {
        console.log(`Theme :: setting theme failed ${e.message}`)
        currentTheme = themes[0].name
        await AsyncStorage.setItem("Theme", currentTheme);
      }
    }

    bootstrapAsync()
  }, []);

  const context = { theme, setTheme, changeTheme }

  return <Provider value={ context }>{props.children}</Provider>;
};

export { ThemeProvider, ThemeContext };
