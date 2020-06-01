import React, { useState, useEffect, useContext } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import SectionListContacts from '../components/SectionListContacts';
import AsyncStorage from '@react-native-community/async-storage';
import AuthContext from "../contexts/Auth"
import contacts from '../utils/contacts';

export default function ContactListScreen ({ route, navigation }) {
  const { signOut } = useContext(AuthContext);

  const [state, setState] = useState({
    loadingItems: false,
    contacts: [],
    counter: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const contacts = await AsyncStorage.getItem('Contacts');
        console.log(`List ${state.counter} ${contacts}`);
        setState({
          loadingItems: true,
          contacts: JSON.parse(contacts) || [],
          counter: state.counter+1
        });
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  handleSelectContact = contact => {
    navigation.push('ContactDetails', contact);
  };

  return (
    <View style={styles.container}>
      { state.contacts.length > 0 
        ? (<SectionListContacts contacts={ state.contacts } onSelectContact={ handleSelectContact } />) 
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
