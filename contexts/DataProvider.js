import React, { createContext, useContext, useState, useEffect } from "react";
import {Alert, Linking, PermissionsAndroid, NativeModules} from 'react-native'
import PropTypes from "prop-types";
import AsyncStorage from '@react-native-community/async-storage'
import testdata from "../utils/contacts"
import Contacts from 'react-native-contacts';
import SendIntentAndroid from 'react-native-send-intent'
import { UserContext } from "../contexts/UserProvider"

const DirectSms = NativeModules.DirectSms

const DataContext = createContext();
const { Provider } = DataContext;

const DataProvider = props => {
  const { user, menu } = useContext(UserContext);

  const [heartbeat, setHeartbeat] = useState({ heartbeat: null })
  const [jobs, setJobs] = useState({ jobs: [] })
  const [contacts, setContacts] = useState({ contacts: [] })
  const [isLoading, setLoading] = useState({ isLoading: false })

  // Runs once!
  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem('@wzpr:Contacts');
      setContacts(JSON.parse(data) || []);
    })();
  }, []);

  // isLoading 
  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem('@wzpr:Contacts');
      if (data !== JSON.stringify(contacts)){
        setContacts(JSON.parse(data) || []);
      }
      const beat = await AsyncStorage.getItem('@wzpr:Heartbeat')
      setHeartbeat(beat)

      const jobs = JSON.parse(await AsyncStorage.getItem('@wzpr:Jobs') || [])
      setJobs(jobs)

    })();
  }, [isLoading]);

  // GLOBAL MENU ACTIONS
  const buncoSquad = async () => {
    setContacts([])
    const status = await AsyncStorage.clear();
    setLoading(!isLoading);
  }

  const sendSMS = (contact, message) => {
    const to = contact ? [contact.phone] : contacts.filter(i => i.checked ).map(i => i.phone)
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.SEND_SMS).then(
      () => {
        DirectSms.sendDirectSms(to.toString(), message);
      })
    setLoading(!isLoading);
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
              console.log(JSON.stringify(ct, null, 4))
              newContacts.push({id: ct.recordID, name: ct.givenName, phone: ct.phoneNumbers[0].number})
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

  const saveJob = (job) => {
    AsyncStorage.setItem('@wzpr:Jobs', JSON.stringify([...jobs.filter(item => item.id !== job.id), job]));
    setLoading(!isLoading)
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

  const selected = () => {
    try {
      return contacts.filter(i => i.checked ).map(i => i.id)
    } catch(error) {
      return []
    }
  }

  contactsContext = {
    jobs,
    setJobs,
    saveJob,
    contacts,
    selected,
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
