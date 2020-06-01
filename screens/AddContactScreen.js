import React, { useState, useEffect, useContext } from 'react';
import AddContactForm from '../components/AddContactForm';
import AsyncStorage from '@react-native-community/async-storage';
import AuthContext from "../contexts/Auth"

export default function AddContactScreen ({ route, navigation }){
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
        console.log(`AddContactScreen ${state.counter} ${contacts}`);
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

  handleSubmit = newContact => {
    contacts = [...state.contacts, newContact]
    AsyncStorage.setItem('Contacts', JSON.stringify(contacts));
    navigation.navigate('ContactList');
  };

  return <AddContactForm onSubmit={ handleSubmit } />;
}

