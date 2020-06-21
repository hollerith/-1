import React, { createContext, useContext, useState, useEffect } from "react";
import {Alert, Linking, PermissionsAndroid, NativeModules} from 'react-native'
import PropTypes from "prop-types";
import AsyncStorage from '@react-native-community/async-storage'
import { UserContext } from "../contexts/UserProvider"
import testdata from "../utils/contacts"
import Contacts from 'react-native-contacts';
import SendIntentAndroid from 'react-native-send-intent'
import BackgroundTask from 'react-native-background-task'

function currentTimestamp(): string {
  const d = new Date()
  const z = n => n.toString().length == 1 ? `0${n}` : n // Zero pad
  return `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}`
}

BackgroundTask.define(
  async () => {
    console.log('Hello from a background task')
    DirectSms.sendDirectSms('07884077434', `This was sent automagically at ${currentTimestamp()}!`);
    await AsyncStorage.setItem('@wzpr:Heartbeat', currentTimestamp())    
    BackgroundTask.finish()
  },
)

const DirectSms = NativeModules.DirectSms

const DataContext = createContext();
const { Provider } = DataContext;

const DataProvider = props => {
  const { user, menu } = useContext(UserContext);

  const [heartbeat, setHeartbeat] = useState({ heartbeat: null })
  const [contacts, setContacts] = useState({ contacts: [] })
  const [isLoading, setLoading] = useState({ isLoading: false })

  // Runs once!
  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem('@wzpr:Contacts');
      setContacts(JSON.parse(data) || []);
      BackgroundTask.schedule()
      checkStatus()
    })();
  }, []);

  const checkStatus = async () => {
    const status = await BackgroundTask.statusAsync()
    console.log(`backgrounded ${status.available}`)
  }

  // isLoading 
  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem('@wzpr:Contacts');
      if (data !== JSON.stringify(contacts)){
        setContacts(JSON.parse(data) || []);
      }
      const beat = await AsyncStorage.getItem('@wzpr:Heartbeat')
      setHeartbeat(beat)
    })();
  }, [isLoading]);

  // GLOBAL MENU ACTIONS
  const buncoSquad = async () => {
    setContacts([])
    const status = await AsyncStorage.clear();
    setLoading(!isLoading);
  }

  const sendSMS = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.SEND_SMS).then(
      () => {
        DirectSms.sendDirectSms('07884077434', 'I am testing your feature! This was sent automagically!');
      })
  }
 
  const syncData = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS).then(
      () => {
        Contacts.getAll((err, incoming) => {
          if (err === 'denied'){
            Alert.alert('Permission to sync denied')
          } else {
            // contacts returned in Array
            let newContacts = []
            incoming.forEach((ct) => {
              newContacts.push({id: new Date().getTime().toString(), name: ct.givenName, phone: ct.phoneNumbers[0].number})
            })
            AsyncStorage.setItem("@wzpr:Contacts", JSON.stringify([...contacts, ...newContacts]))
            setLoading(!isLoading)
          }
        })
      }
    )
  }

  const loadData = async () => {
    setContacts(testdata)
    const status = await AsyncStorage.setItem("@wzpr:Contacts", JSON.stringify(testdata));
    setLoading(!isLoading);
  }

  const merged = (contacts, contact) => { 
    return [...contacts.filter(item => item.id !== contact.id), contact] 
  }

  const checkContact = (contact) => {
    if (contact.checked) {
      setContacts(merged(contacts, {id: contact.id, name: contact.name, phone: contact.phone }))
    } else {
      setContacts(merged(contacts, {id: contact.id, name: contact.name, phone: contact.phone, checked: true }))
    }
  }

  const saveContact = (contact) => {
    AsyncStorage.setItem('@wzpr:Contacts', JSON.stringify([...contacts.filter(item => item.id !== contact.id), contact]));
    setLoading(!isLoading)
  }

  const reloadContacts = () => {
    setLoading(!isLoading)
  }

  const callContact = (contact) => {
    Linking.openURL(`tel:${contact.phone}`)
  }

  const smsContacts = (contact) => {
    const where = contact ? [contact.phone] : contacts.filter(i => i.checked ).map(i => i.phone)
    Linking.openURL(`sms:${where.toString()}${Platform.OS === "ios" ? "&" : "?"}body=${":)"}`)
  }

  const msgContact = (contact) => {
    SendIntentAndroid.sendText({
      title: "Please share this text",
      text: JSON.stringify((contacts.filter(i => i.checked) === [] ? contacts : contacts.filter(i => i.checked)), null, 4),
      type: SendIntentAndroid.TEXT_PLAIN,
    });
  }

  const addContact = async (contact) => {
    await AsyncStorage.setItem('@wzpr:Contacts', JSON.stringify(contacts.concat([contact])));
    setLoading(!isLoading);
  }

  const deleteContacts = (contact) => {
    const where = contact ? [contact.id] : contacts.filter(i => i.checked ).map(i => i.id)
    Alert.alert('Delete Warning',`All selected items (${where.length}) will be removed.`,
      [
        { 
          text: 'OK', 
          onPress: () => {
            const Contacts = JSON.stringify( contacts.filter((item) => { return where.indexOf(item.id) == -1 }))
            AsyncStorage.setItem("@wzpr:Contacts", Contacts)  
            setLoading(!isLoading);
          }
        },
        {
          text: 'Cancel',
          onPress: () => setLoading(!isLoading),
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
    sendSMS,
    callContact,
    smsContacts,
    reloadContacts,
    deleteContacts,
    checkContact,
    saveContact,
    buncoSquad,
    loadData,
    syncData,
    heartbeat
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
