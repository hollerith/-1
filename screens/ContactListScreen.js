import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SectionListContacts from '../components/SectionListContacts';
import AsyncStorage from '@react-native-community/async-storage';
import { DataContext } from "../contexts/DataProvider"

export default function ContactListScreen ({ navigation }) {
  const { contacts } = useContext(DataContext);

  const handleSelectContact = contact => {
    navigation.push('ContactDetails', { name: contact.name, phone: contact.phone });
  };

  return (
    <View style={styles.container}>
      { contacts.length > 0 
        ? (<SectionListContacts contacts={ contacts } onSelectContact={ handleSelectContact } />) 
        : (<Text style={ styles.banner }>You have no friends</Text>)
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
    color: "tomato"
  },
});
