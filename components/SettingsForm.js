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
import BackgroundTimer from 'react-native-background-timer'

import { DataContext } from "../contexts/DataProvider"
import { UserContext } from "../contexts/UserProvider"
import { ThemeContext } from "../contexts/ThemeProvider"

function SettingsForm({ route, navigation }) {

  const { heartbeat } = useContext(DataContext)
  const { theme } = useContext(ThemeContext)
  const { user, menu } = useContext(UserContext);

  const [account, setAccount] = useState({ name: user.username, isValid: true })
  const [phone, setPhone] = useState({ phone: "disabled" })
  const [voicemail, setVoiceMail] = useState({ voicemail: "disabled" })

  const [selectedTheme, setSelectedTheme] = useState("ScreamOfTomato")

  const getPhoneNumber = async () => {
    // Show own phone number
    const phoneNumber = await SendIntentAndroid.getPhoneNumber()
    if (!phoneNumber) {
      Alert.alert("Can`t get phoneNumber")
      return
    } else {
      setPhone(phoneNumber)
    }  
  }

  const getVoiceMail = async () => {
    // Show voicemail number
    const voiceMailNumber = await SendIntentAndroid.getVoiceMailNumber()
    if (!voiceMailNumber) {
      Alert.alert("Can`t get voiceMailNumber")
    } else {
      setVoiceMail(voiceMailNumber)
    }    
  }

  useEffect(() => {
    
    // Ask for permissions to read phone numbers
    const getPermissions = async () => {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE).then(
        (granted) => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getPhoneNumber()
            getVoiceMail()
          } else {
            Alert.alert(`READ_PHONE_STATE :: ${JSON.stringify(granted)}`)
          }            
        }
      )
    }

    getPermissions()
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
      color: theme.bannerColor
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
          <TouchableOpacity style={styles.menuListItem}
              onPress={() => {
                navigation.push('Profile')
              }}>
            <Icon style={[styles.menuListIcon, { color: theme.activeHintColor}]} name="account" size={36}/> 
            <Text 
              style={[ styles.textinput, styles.text] }
            >{ account.name }</Text>
            <Icon style={styles.menuListIcon} name="chevron-right" size={36}/>
          </TouchableOpacity>
        </View>

        <View style={styles.menuListItemBorder}>
          <TouchableOpacity style={styles.menuListItem}
              onPress={() => {
                navigation.push('Themes')
              }}>
            <Icon style={[styles.menuListIcon, { color: "red"}]} name="palette" size={36}/> 
            <Text 
              style={[ styles.textinput, styles.text] }
            >{ theme.name }</Text>
            <Icon style={styles.menuListIcon} name="chevron-right" size={36}/>
          </TouchableOpacity>
        </View>

        <Setting 
          icon="cassette" 
          iconColor="darkorange"
          label="Call Voicemail"
          hint={`${voicemail}`}
          onPress={() => {
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

        <Setting 
          icon="clock" 
          iconColor="purple"
          label="Suspend Jobs"
          hint={`${heartbeat}`}
          onPress={() => {
            navigation.navigate("Jobs")
          }}          
        />

      </View>
    </ScrollView>
  );
}

export default SettingsForm
