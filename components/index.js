import React from "react";
import { View, Text, Image } from "react-native";

import AddContactForm from "./AddContactForm"
import FlatListContacts from "./FlatListContacts"
import ScrollViewContacts from "./ScrollViewContacts"
import SectionListContacts from "./SectionListContacts"

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

export { 
  LogoTitle, 
  SplashScreen, 
  AddContactForm,
  FlatListContacts,
  ScrollViewContacts,
  SectionListContacts,
}
