import React, { useState, useEffect, useContext } from 'react';
import { Alert, Button, Image, PermissionsAndroid, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import SendIntentAndroid from 'react-native-send-intent'
import Clipboard from "@react-native-community/clipboard"

import { UserContext } from "../contexts/UserProvider"

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

const MastHead = (props) => (
  <HeaderButton {...props} IconComponent={Icon} iconSize={32} color="grey" />
);

function Settings({ route, navigaton }) {
  const { user, menu } = useContext(UserContext);

  const [state, setState] = useState({
    phone: "07738170000",
    voicemail: "911",
    username: user.username
  })

  const [phone, setPhone] = useState({ phone: "07738170000" })
  const [voicemail, setVoiceMail] = useState({ voicemail: "07738172222" })
  const [username, setUsername] = useState({ ...user })

  useEffect(() => {
// (async () => {

      console.log(`\n\x1b[35m${JSON.stringify(user, null, 4)} \x1b[0m`)
      AsyncStorage.getItem('name').then(name => {
        console.log(`Retrieved ${name} from AsyncStorage`);
        setState({ ...state, username: name})
        console.log(`\n\x1b[32m${JSON.stringify(user, null, 4)} \x1b[0m`)
      })

      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        {
          'title': 'Contacts',
          'message': 'This app would like to view your number.',
          'buttonPositive': 'Please accept bare mortal'
        }
      ).then(() => {

        // Show voicemail number
        SendIntentAndroid.getVoiceMailNumber().then(voiceMailNumber => {
          if (!voiceMailNumber) {
            return console.error("Can`t get voiceMailNumber");
          }
          console.log(`Read phone state : voicemail ${voiceMailNumber}`)
          return voiceMailNumber
        }).then((voiceMailNumber) => {

          // Show own phone number
          SendIntentAndroid.getPhoneNumber().then(phoneNumber => {
            if (!phoneNumber) {
              return console.error("Can`t get phoneNumber");
            }
            console.log(`Read phone state : phone ${phoneNumber}`)
            setState({ ...state, phone: phoneNumber, voicemail, voiceMailNumber })
          });

        })


      })

//  })();
  }, []);

  return (
    <ScrollView style={{padding: 20}}>
      <Text style={ styles.banner }>
        Settings
      </Text>

      <View style={{margin:10}} />
      <Button
        title={`Share ${state.phone}`}
        onPress={() => {
          console.log(`Share ${state.phone}`)
          SendIntentAndroid.sendText({
            title: "Share phone details",
            text: `${state.username}'s burner ${state.phone}.`,
            type: SendIntentAndroid.TEXT_PLAIN,
          });
        }}
      />

      <View style={{margin:10}} />
      <Button
        title={ `Call voicemail ${state.voicemail}` }
        onPress={() => {
          console.log(state.voicemail)
          SendIntentAndroid.sendPhoneCall(state.voicemail);
        }}
      />
      <View style={{margin:20}} />

      <TextInput
        style={ styles.textinput }
        placeholder="Your name here"
        value={state.username}
        onChangeText={data => setState({ ...state, username: data }) }
      />

      <View style={{margin:20}} />
      <Button
        title="Save" 
        onPress={() => {
          console.log(`Saving ${state.username}`)
          AsyncStorage.setItem('name', state.username);
        }}
      />
    </ScrollView>
  );
}

const Stack = createStackNavigator();

export default function SettingsScreen({ navigation }) {

  const { menu } = useContext(UserContext);
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
          <HeaderButtons HeaderButtonComponent={MastHead}>
            <OverflowMenu
              style={{ marginHorizontal: 10 }}
              OverflowIcon={<Icon name="menu" size={32} color="grey" />}
            >
              <HiddenItem title="Bunco" onPress={() => alert('Bunco')} />
              <HiddenItem title="Sign Out" onPress={menu.signOut} />
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
  phone: {
    fontSize: 36,
    textAlign: "center",
    color: "purple"
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
