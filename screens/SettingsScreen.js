import React, { useState, useEffect, useContext } from 'react';
import { Alert, Button, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';

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
  const { signOut } = useContext(AuthContext);

  const [state, setState] = useState({
    name: "liveuser",
  });

  useEffect(() => {
    (async () => {
      AsyncStorage.getItem('name').then(value => {
        console.log(`Retrieved ${value} from AsyncStorage`);
        setState({ ...state, 'name' : value });
      });
    })();
  }, []);

  return (
    <ScrollView style={{padding: 20}}>
      <Text style={ styles.banner }>
        Settings
      </Text>

      <TextInput
        style={ styles.textinput }
        placeholder="State your name here"
        value={state.name}
        onChangeText={data => setState({ name: data }) }
      />

      <View style={{margin:20}} />
      <Button
        title="Save" 
        onPress={() => {
          console.log(`Saving ${JSON.stringify(state.name)}`)
          AsyncStorage.setItem('name', state.name);
        }}
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
      <Stack.Screen name="Settings" component={Settings} options={{title: 'Settings'}} />
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
    fontSize: 32,
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
