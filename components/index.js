import React, { useContext } from "react"
import { View, Text, Image, ImageBackground } from "react-native"
import { ThemeContext } from "../contexts/ThemeProvider"
import { HeaderButton } from 'react-navigation-header-buttons'
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

const Masthead = (props) => {
  const { theme } = useContext(ThemeContext)
  return (
    <HeaderButton {...props} IconComponent={Icon} iconSize={32} color={ theme.iconColor } />
  )
}

function SplashScreen() {
  return (
    <>
      <ImageBackground style={{ width: 600, height: 600 }} resizeMode='cover' source={require('../assets/tomatocream.gif')}/>
    </>
  );
}

function LogoTitle() {
  return (
    <Image
      style={{ width: 32, height: 32 }}
      source={require('../assets/logo.png')}
    />
  );
}

export { SplashScreen, LogoTitle, Masthead }

