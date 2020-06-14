import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import { 
  Alert, 
  Button, 
  PermissionsAndroid, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity,
  View 
} from "react-native"

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-community/async-storage';
import SendIntentAndroid from 'react-native-send-intent'

import { UserContext } from "../contexts/UserProvider"

const Setting = props => (
  <View style={styles.menuListItemBorder}>
    <TouchableOpacity onPress={() => props.onPress()}>
      <View style={styles.menuListItem}>
        <Icon style={styles.menuListIcon} name={props.icon} size={48}/>
        <Text style={styles.menuListLabel}>{props.label}</Text>
        <Icon style={styles.menuListIcon} name="chevron-right" size={48}/>
      </View>
    </TouchableOpacity>
  </View>
)

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
      <View style={{ flex: 1}}>
        <View style={styles.menuListItemBorder}>
          <View style={styles.menuListItem}>
            <Icon style={styles.menuListIcon} name="account" size={48}/>
            <TextInput style={[ styles.textinput, styles.text] }>{ user.username }</TextInput>
            <TouchableOpacity 
              onPress={() => {
                Alert.alert('Chnaged')
              }}>
              <Icon style={[styles.menuListIcon, { color: "green"} ]} name="check-circle" size={48}/>
            </TouchableOpacity>
          </View>
        </View>

        <Setting 
          icon="cassette" 
          label={`Call ${voicemail}`} 
          onPress={() => {
            console.log(voicemail)
            SendIntentAndroid.sendPhoneCall(voicemail);
          }}
        />

        <Setting 
          icon="share" 
          label={`Share ${phone}`} 
          onPress={() => {
            SendIntentAndroid.sendText({
              title: "Share phone details",
              text: `${user.username}'s burner ${phone}.`,
              type: SendIntentAndroid.TEXT_PLAIN,
            });
          }}
        />
      </View>
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
    fontSize: 22,
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: 'lightgrey',
    minWidth: 100,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
  },
  text: {
    textAlign: "center",
    flex: 1
  },
  menuListItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  menuListItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuListIcon: {
    color: "#999",
  },
  menuListLabel: {
    marginVertical: 8,
    fontSize: 20,
    fontWeight: "bold",
  },
});
