import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SectionListContacts from '../components/SectionListContacts';
import AsyncStorage from '@react-native-community/async-storage';
import { DataContext } from "../contexts/DataProvider"

export default function ContactListScreen ({ navigation }) {
  const { contacts, checkContact } = useContext(DataContext);

  const handleCheckContact = contact => {
    checkContact(contact)
    console.log(`Checked ${JSON.stringify(contact)}`)
  };

  const handleSelectContact = contact => {
    const { id, name, phone, checked } = contact
    navigation.push('ContactDetails', { id, name, phone, checked });
  };

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

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1
  },
  banner: {
    fontSize: 36,
    fontFamily: "Lobster-Regular",
    textAlign: "center",
    color: "gray"
  },
});
