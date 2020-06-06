import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import AsyncStorage from '@react-native-community/async-storage'
import { UserContext } from "../contexts/UserProvider"

const DataContext = createContext();
const { Provider } = DataContext;

const DataProvider = props => {
  const { user, menu } = useContext(UserContext);

  const [contacts, setContacts] = useState({ contacts: [] });
  const [isLoading, setLoading] = useState({ isLoading: false });

  // re-renders
  useEffect(() => {
    console.log(`On every render `);
  });

  // global state changed
  useEffect(() => {
    console.log(`On change contacts`);
  }, [contacts]);

  useEffect(() => {
    console.log(`On change isLoading`);
    (async () => {
      try {
        const data = await AsyncStorage.getItem('Contacts');
        setContacts(JSON.parse(data) || []);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [isLoading]);

  // Runs once!
  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem('Contacts');
        setContacts(JSON.parse(data) || []);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const buncoSquad = async () => {
    console.log('DataContext::buncoSquad');
    setContacts([])
    const status = await AsyncStorage.clear();
    setLoading(!isLoading);
  }

  const addContact = async (contact) => {
    console.log('DataContext::addContact');
    await AsyncStorage.setItem('Contacts', JSON.stringify(contacts.concat([contact])));
    setLoading(!isLoading);
  }

  const deleteContact = async (contact) => {
    console.log('DataContext::deleteContact');
    await AsyncStorage.setItem("Contacts", 
      JSON.stringify( 
        contacts.filter((item) => { 
          return item.id !== contact.id 
        })
      )
    );
    setLoading(!isLoading);
  }

  contactsContext = {
    contacts,
    setContacts,
    addContact,
    deleteContact,
    buncoSquad,
  }
  
  return <Provider value={ contactsContext }>{props.children}</Provider>;
};

export { DataProvider, DataContext };

Provider.propTypes = {
  contacts: PropTypes.array,
};

Provider.defaultProps = {
  contacts: [],
};
