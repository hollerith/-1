import React, { useState, useEffect, useContext } from 'react';
import { 
  Alert, 
  Button, 
  PermissionsAndroid, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  View 
} from "react-native"

import AsyncStorage from '@react-native-community/async-storage';
import SendIntentAndroid from 'react-native-send-intent'

import { UserContext } from "../contexts/UserProvider"

function SettingsForm({ route, navigaton }) {
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
      <View style={{margin:10}} />
      <View>      
        <TextInput style={[ styles.textinput, styles.text] }>{ user.username }</TextInput>
        <Button
          title="Save"
          onPress={() => {
            Alert.alert('Change username')
          }}
        />
        <Text style={[ styles.textinput, styles.text] }>{`Share ${phone}`}</Text>
        <Button
          title="Share"
          onPress={() => {
            SendIntentAndroid.sendText({
              title: "Share phone details",
              text: `${user.username}'s burner ${phone}.`,
              type: SendIntentAndroid.TEXT_PLAIN,
            });
          }}
        />
      </View>
      <View style={{margin:10}} />
      <View>
        <Text style={[ styles.textinput, styles.text] }>{`Voicemail ${voicemail}` }</Text>
        <Button
          title="Call"
          onPress={() => {
            console.log(voicemail)
            SendIntentAndroid.sendPhoneCall(voicemail);
          }}
        />
      </View>
      <View style={{margin:20}} />
    </ScrollView>
  );
}

export default SettingsForm

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
    fontSize: 18,
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
