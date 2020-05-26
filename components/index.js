import React from "react";
import { View, Text, Image } from "react-native";

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require('../assets/logo.png')}
    />
  );
}

export { LogoTitle, SplashScreen }
