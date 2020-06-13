import React, { createContext, useContext, useState, useEffect } from "react";
import {Alert, Linking, PermissionsAndroid} from 'react-native'
import PropTypes from "prop-types";
import AsyncStorage from '@react-native-community/async-storage'
import { UserContext } from "../contexts/UserProvider"
import testdata from "../utils/contacts"
import Contacts from 'react-native-contacts';
import SendIntentAndroid from 'react-native-send-intent'

const DataContext = createContext();
const { Provider } = DataContext;

const DataProvider = props => {
  const { user, menu } = useContext(UserContext);

  const [contacts, setContacts] = useState({ contacts: [] });
  const [isLoading, setLoading] = useState({ isLoading: false });

  // re-renders
  useEffect(() => {
    //console.log(`On every render `);
  });

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

  // isLoading 
  useEffect(() => {
    console.log(`On change isLoading`);
    (async () => {
      try {
        const data = await AsyncStorage.getItem('Contacts');
        if (data !== JSON.stringify(contacts)){
          console.log(` ~> loading...`);    
          setContacts(JSON.parse(data) || []);
        }
        //console.log(`DataContext::contacts \n ${JSON.stringify(contacts, null, 4)}`);
      } catch (err) {
        console.log(`Onchange isLoading error \n ~> ${err.message}`);
      }
    })();
  }, [isLoading]);

  // contacts
  useEffect(() => {
    //console.log(`On change contacts`);
    //console.log(`DataContext::contacts \n ${JSON.stringify(contacts, null, 4)}`);
  }, [contacts]);

  // GLOBAL MENU ACTIONS
  const buncoSquad = async () => {
    console.log('DataContext::buncoSquad');
    setContacts([])
    const status = await AsyncStorage.clear();
    setLoading(!isLoading);
  }
 
  const syncData = () => {
    console.log('DataContext::syncData');
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        'title': 'Contacts',
        'message': 'This app would like to view your contacts.',
        'buttonPositive': 'Please accept bare mortal'
      }
    ).then(() => {
      Contacts.getAll((err, incoming) => {
        if (err === 'denied'){
          // error
          console.log(`${err.message}`)
        } else {
          // contacts returned in Array
          console.log(`${JSON.stringify(incoming, null, 4)}`)
          let newContacts = []
          incoming.forEach((ct) => {
            console.log(`id:  name: ${ct.givenName}, phone: ${ct.phoneNumbers[0].number}`)
            newContacts.push({id: new Date().getTime().toString(), name: ct.givenName, phone: ct.phoneNumbers[0].number})
          })
          console.log(`new synced ${JSON.stringify([...contacts, ...newContacts], null, 4)}`)
          AsyncStorage.setItem("Contacts", JSON.stringify([...contacts, ...newContacts]))
          setLoading(!isLoading)
        }
      })
    })
  }

  const loadData = async () => {
    console.log('DataContext::loadData');
    setContacts(testdata)
    const status = await AsyncStorage.setItem("Contacts", JSON.stringify(testdata));
    setLoading(!isLoading);
  }

  const merged = (contacts, contact) => { 
    return [...contacts.filter(item => item.id !== contact.id), contact] 
  }

  const checkContact = (contact) => {
    console.log('DataContext::checkContact');
    console.log(`  ~>checked - ${JSON.stringify(contact.checked)}`);
    if (contact.checked) {
      setContacts(merged(contacts, {id: contact.id, name: contact.name, phone: contact.phone }))
    } else {
      setContacts(merged(contacts, {id: contact.id, name: contact.name, phone: contact.phone, checked: true }))
    }
  }

  const saveContact = (contact) => {
    console.log(`DataContext::saveContact:::${contact.name}`);
    AsyncStorage.setItem('Contacts', JSON.stringify([...contacts.filter(item => item.id !== contact.id), contact]));
    setLoading(!isLoading)
  }

  const reloadContacts = () => {
    console.log('DataContext::clearContacts');
    setLoading(!isLoading)
  }

  const callContact = (contact) => {
    console.log('DataContext::callContact');
    Linking.openURL(`tel:${contact.phone}`)
  }

  const smsContacts = (contact) => {
    console.log('DataContext::smsContact');
    const where = contact ? [contact.phone] : contacts.filter(i => i.checked ).map(i => i.phone)
    Linking.openURL(`sms:${where.toString()}${Platform.OS === "ios" ? "&" : "?"}body=${":)"}`)
  }

  const msgContact = (contact) => {
    console.log('DataContext::msgContact');
    SendIntentAndroid.sendText({
      title: "Please share this text",
      text: JSON.stringify((contacts.filter(i => i.checked) === [] ? contacts : contacts.filter(i => i.checked)), null, 4),
      type: SendIntentAndroid.TEXT_PLAIN,
    });
  }

  const addContact = async (contact) => {
    console.log('DataContext::addContact');
    await AsyncStorage.setItem('Contacts', JSON.stringify(contacts.concat([contact])));
    setLoading(!isLoading);
  }

  const deleteContacts = (contact) => {
    console.log('DataContext::deleteContacts');
    const where = contact ? [contact.id] : contacts.filter(i => i.checked ).map(i => i.id)
    Alert.alert('Delete Warning',`All selected items (${where.length}) will be removed.`,
      [
        { 
          text: 'OK', 
          onPress: () => {
            const Contacts = JSON.stringify( contacts.filter((item) => { return where.indexOf(item.id) == -1 }))
            console.log(` ~>Where - ${JSON.stringify(where)} from ${contacts.length} to ${JSON.parse(Contacts).length}`);
            AsyncStorage.setItem("Contacts", Contacts)  
            setLoading(!isLoading);
          }
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        }
      ],
      { cancelable: false }
    );
  }

  contactsContext = {
    contacts,
    setContacts,
    addContact,
    msgContact,
    callContact,
    smsContacts,
    reloadContacts,
    deleteContacts,
    checkContact,
    saveContact,
    buncoSquad,
    loadData,
    syncData,
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
