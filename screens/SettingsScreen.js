import React from 'react';
import { Alert, Button, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';

import AuthContext from "../contexts/Auth"
import { LogoTitle, SplashScreen } from "../components"

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import {
  HeaderButtons,
  HeaderButton,
  Item,
  HiddenItem,
  OverflowMenu,
  OverflowMenuProvider
} from 'react-navigation-header-buttons';

const IoniconsHeaderButton = (props) => (
  <HeaderButton {...props} IconComponent={Icon} iconSize={32} color="grey" />
);

function Settings({ route, navigaton }) {
  const { signOut } = React.useContext(AuthContext);

  return (
    <ScrollView style={{padding: 20}}>
      <Text 
          style={ styles.banner }>
          Settings
      </Text>
      <View style={{margin:20}} />
      <Button
        title="Logout" onPress={signOut}
      />
    </ScrollView>
  );
}

const Stack = createStackNavigator();

export default function SettingsScreen({ navigation }) {

  const { signOut } = React.useContext(AuthContext);
  const onPress = () => { navigation.push('AddContact') };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: props => <LogoTitle {...props} />,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTintColor: 'grey',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => (
          <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
            <OverflowMenu
              style={{ marginHorizontal: 10 }}
              OverflowIcon={<Icon name="menu" size={32} color="grey" />}
            >
              <HiddenItem title="Bunco" onPress={() => alert('Bunco')} />
              <HiddenItem title="Sign Out" onPress={signOut} />
            </OverflowMenu>
          </HeaderButtons>
        ),
      }}
    >
      <Stack.Screen name="Settings" component={Settings} options={{ title: "Settings" }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1
  },
  banner: {
    fontSize: 36,
    fontFamily: "Lobster-Regular",
    textAlign: "center",
    color: "tomato"
  },
  textinput: {
    fontSize: 24,
    borderWidth: 1,
    borderColor: 'lightgrey',
    minWidth: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
  },
  text: {
    textAlign: "center"
  }
});
