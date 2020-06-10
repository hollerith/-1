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

  const [phone, setPhone] = useState({ phone: "07738170000" })
  const [voicemail, setVoiceMail] = useState({ voicemail: "07738172222" })

  useEffect(() => {
    (async () => {

      const granted = PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE, {
        'title': 'Permissions to read phone number',
        'message': 'This app would like to read phone state.',
        'buttonPositive': 'Allow'
      })

      if (granted) {
        // Show own phone number
        const phoneNumber = await SendIntentAndroid.getPhoneNumber()
        if (!phoneNumber) {
          return console.error("Can`t get phoneNumber");
        } else {
          console.log(`Read phone state : phone ${phoneNumber}`)
          setPhone(phoneNumber)
        }

        // Show voicemail number
        const voiceMailNumber = await SendIntentAndroid.getVoiceMailNumber()
        if (!voiceMailNumber) {
          return console.error("Can`t get voiceMailNumber");
        } else {
          console.log(`Read phone state : voicemail ${voiceMailNumber}`)
          setVoiceMail(voiceMailNumber)
        }
      }

    })();
  }, []);

  return (
    <ScrollView style={{padding: 20}}>
      <Text style={ styles.banner }>
        Settings
      </Text>

      <Text style={[ styles.textinput, styles.text] }>{ user.username }</Text>

      <View style={{margin:10}} />
      <Button
        title={`Share ${phone}`}
        onPress={() => {
          console.log(`Share ${phone}`)
          SendIntentAndroid.sendText({
            title: "Share phone details",
            text: `${user.username}'s burner ${phone}.`,
            type: SendIntentAndroid.TEXT_PLAIN,
          });
        }}
      />

      <View style={{margin:10}} />
      <Button
        title={ `Call voicemail ${voicemail}` }
        onPress={() => {
          console.log(voicemail)
          SendIntentAndroid.sendPhoneCall(voicemail);
        }}
      />
      <View style={{margin:20}} />

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
