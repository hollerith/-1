import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SectionListContacts from '../components/SectionListContacts';
import AsyncStorage from '@react-native-community/async-storage';
import { DataContext } from "../contexts/DataProvider"
import { ThemeContext } from "../contexts/ThemeProvider"

export default function ContactListScreen ({ navigation }) {
  const { contacts, checkContact } = useContext(DataContext);
  const { theme } = useContext(ThemeContext)

  const handleCheckContact = contact => {
    checkContact(contact)
  };

  const handleSelectContact = contact => {
    const { id, name, phone, notes, checked } = contact
    navigation.push('ContactDetails', { id, name, phone, notes, checked });
  };

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
  });

  return (
    <View style={styles.container}>
      { contacts.length > 0 
        ? (<SectionListContacts 
            contacts={ contacts } 
            onSelectContact={ handleSelectContact } 
            onCheckContact={ handleCheckContact } 
           />) 
        : (<Text style={ styles.banner }>No friends yet</Text>)
      }
    </View>
  );
}
