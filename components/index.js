import React from "react";
import { View, Text, Image, ImageBackground } from "react-native";

function SplashScreen() {
  return (
    <>
      <ImageBackground style={{ width: 550, height: 550 }} resizeMode='cover' source={require('../assets/tomatocream.gif')}/>
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

export { SplashScreen, LogoTitle }

