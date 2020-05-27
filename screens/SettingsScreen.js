import React from "react";
import { Button, ScrollView, View, StyleSheet, Text } from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function SettingsScreen({ route, navigaton }) {
  return (
    <ScrollView style={{padding: 20}}>
      <Text 
          style={{fontSize: 27}}>
          Welcome
      </Text>
      <View style={{margin:20}} />
      <Button
        title="Logout"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1
  },
  text: {
    textAlign: "center"
  }
});
