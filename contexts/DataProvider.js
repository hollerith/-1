import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import AsyncStorage from '@react-native-community/async-storage'
import { UserContext } from "../contexts/UserProvider"

const DataContext = createContext();
const { Provider } = DataContext;

const DataProvider = props => {
  const { user, menu } = useContext(UserContext);
  const [state, setState] = useState({ contacts: [] });

  // re-renders
  useEffect(() => {
    console.log(`On every render ${JSON.stringify(state)}`);
  });

  // global state changed
  useEffect(() => {
    console.log(`On change state ${JSON.stringify(state)}`);
  }, [state]);

  // Runs once!
  useEffect(() => {
    (async () => {
      try {
        const contacts = await AsyncStorage.getItem('Contacts');
        setState({...state, contacts: JSON.parse(contacts) || []});
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  contactsContext = {
    contacts: state.contacts,
    setContacts: setState
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
