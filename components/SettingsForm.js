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
import { ThemeContext } from "../contexts/ThemeProvider"


function SettingsForm({ route, navigaton }) {

  const { theme } = useContext(ThemeContext)
  const { user, menu } = useContext(UserContext);

  const [account, setAccount] = useState({ name: user.username, isValid: true })
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

  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      flex: 1
    },
    banner: {
      fontSize: 36,
      fontFamily: theme.bannerFontFamily,
      textAlign: "center",
      color: theme.activeTintColor
    },
    textinput: {
      fontSize: 22,
      fontWeight: "bold",
      borderWidth: 1,
      borderColor: theme.borderColor,
      minWidth: 100,
      marginHorizontal: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 3,
    },
    text: {
      textAlign: "center",
      color: theme.textColor,
      backgroundColor: theme.textBackgroundColor,
      flex: 1
    },
    menuListItemBorder: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: theme.borderColor,
    },
    menuListItem: {
      paddingVertical: 16,
      paddingHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    menuListIcon: {
      color: theme.menuListIconColor,
    },
    menuListLabel: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.textColor,
      backgroundColor: theme.textBackgroundColor,
    },
  });

  const Setting = props => (
    <View style={styles.menuListItemBorder}>
      <TouchableOpacity onPress={() => props.onPress()}>
        <View style={styles.menuListItem}>
          <Icon style={[styles.menuListIcon, { color: props.iconColor}]} name={props.icon} size={36}/>
          <View>
            <Text style={styles.menuListLabel}>{props.label}</Text>
            <Text style={[styles.text, {fontSize: 12}]}>{props.hint}</Text>
          </View>
          <Icon style={styles.menuListIcon} name="chevron-right" size={36}/>
        </View>
      </TouchableOpacity>
    </View>
  )

  return (
    <ScrollView style={{backgroundColor: theme.backgroundColor}}>
      <Text style={ styles.banner }>
        Settings
      </Text>
      <View style={{ flex: 1}}>
        <View style={styles.menuListItemBorder}>
          <View style={styles.menuListItem}>
            <Icon style={[styles.menuListIcon, { color: "black"}]} name="account" size={36}/>
            <TextInput 
              style={[ styles.textinput, styles.text] }
              onChangeText={ (value) => { 
                if (value.length > 0) return setAccount({ name: value, isValid: true}) 
                return setAccount({ name: value, isValid: false}) 
              }}
            >{ account.name }</TextInput>
            <TouchableOpacity 
              onPress={() => {
                if (account.isValid) {
                  menu.changeUser({ username: account.name })
                  Alert.alert('Changed')
                }
              }}>
              <Icon 
                name="check-circle" 
                style={[
                  styles.menuListIcon, 
                  { color: account.isValid ? "green" : theme.inactiveTintColor } 
                ]} 
                size={36}/>
            </TouchableOpacity>
          </View>
        </View>

        <Setting 
          icon="cassette" 
          iconColor="darkorange"
          label="Call Voicemail"
          hint={`${voicemail}`}
          onPress={() => {
            console.log(voicemail)
            SendIntentAndroid.sendPhoneCall(voicemail);
          }}
        />

        <Setting 
          icon="share" 
          label="Share number"
          iconColor="skyblue"
          hint={`${phone}`}
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
