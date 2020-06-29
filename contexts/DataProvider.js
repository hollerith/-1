import React, { createContext, useContext, useState, useEffect } from "react";
import {Alert, Linking, PermissionsAndroid, NativeModules} from "react-native"
import PropTypes from "prop-types";
import AsyncStorage from "@react-native-community/async-storage"
import Clipboard from "@react-native-community/clipboard"
import testdata from "../utils/contacts"
import Contacts from "react-native-contacts"
import SendIntentAndroid from "react-native-send-intent"
import BackgroundTimer from 'react-native-background-timer'
import Sound from 'react-native-sound';
import { UserContext } from "../contexts/UserProvider"

const DirectSms = NativeModules.DirectSms

const DataContext = createContext();
const { Provider } = DataContext;

// Local datetime adjusted string
function displayTime() {
  const d = new Date()
  const z = n => n.toString().length == 1 ? `0${n}` : n // Zero pad
  return `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}`
}

function addMinutes(date, minutes) { return new Date(date.getTime() + minutes*60000); }

function playSound() {
  const sound = new Sound('../assets/chimes.mp3', '', (error) => {
    if (error) {
      console.log(`Error : ${error.message}`)
      return
    } else {
      console.log('duration in seconds: ' + sound.getDuration() + 'number of channels: ' + sound.getNumberOfChannels())
    }

    // play when loaded
    try {
      sound.play();
      Alert.alert('The sound is still playing?')
      sound.stop();
    } catch(exception) {
      console.log(`Exception : ${exception.message}`)
    }
  });
}

const DataProvider = props => {
  const { user, menu } = useContext(UserContext);

  const [heartbeat, setHeartbeat] = useState({ heartbeat: null })
  const [jobs, setJobs] = useState({ jobs: [] })
  const [contacts, setContacts] = useState({ contacts: [] })
  const [isLoading, setLoading] = useState({ isLoading: false })

  // Fork the background timer to run jobs
  useEffect(() => {
    (async () => {

      const data = await AsyncStorage.getItem('@wzpr:Contacts');
      setContacts(JSON.parse(data) || []);

      BackgroundTimer.stopBackgroundTimer()
      BackgroundTimer.runBackgroundTimer(async () => {

        const heartbeat = displayTime()
        AsyncStorage.setItem('@wzpr:Heartbeat', heartbeat)

        const jobs = JSON.parse(await AsyncStorage.getItem("@wzpr:Jobs")) || []
        console.log(`\x1b[H\x1b[2J\n   \x1b[1m\x1b[33mWZPR Jobs pending :: ${jobs.length}    \x1b[31m\x1b[1m\x1b[5m ❤ \x1b[0m\x1b[34m${heartbeat}\x1b[0m`)
        console.log(`\x1b[1m\x1b[33m\n${JSON.stringify(jobs, null, 4)}\x1b[0m`)

        const backlog = []
        jobs.forEach((job) => {
          if ((new Date()) > (new Date(job.schedule)) && !job.disabled) {

            switch (job.action) {
              case 'message':
                console.log(`\x1b[34mSending SMS to ${job.to.toString()}\x1b[0m`)
                DirectSms.sendDirectSms(job.to.toString(), job.text);
                break;
              case 'alarm':
                console.log(`\x1b[34mPlay sound \x1b[0m`)
                playSound()
                break
              case 'alert':
                Alert.alert(job.text)
                break
              default:
                console.log(`\x1b[34m\nLogging :: ${job.schedule} ::\n\x1b[32m ${job.text} \x1b[0m`)
                break
            }

            if (job.repeat != "once") {
              switch (job.repeat) {
                case 'month':
                  date = new Date()
                  job.schedule = new Date(date.setMonth(date.getMonth()+1));
                  break
                case 'quarter':
                  job.schedule = new Date(date.setMonth(date.getMonth()+3));
                  break
                case 'year':
                  job.schedule = new Date(date.setMonth(date.getMonth()+12));
                  break
                default:
                  job.schedule = addMinutes(new Date(), +job.repeat)
                  break
              }
              backlog.push(job) // push updated job back on the queue
            }
          } else {
            backlog.push(job)
          }
        })

        if (jobs.length > backlog.length) {
          AsyncStorage.setItem('@wzpr:Jobs', JSON.stringify(backlog))
          setLoading(!isLoading);
        }
      }, 30000);

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
              newContacts.push({
                id: ct.recordID, 
                name: ct.givenName, 
                phone: ct.phoneNumbers[0].number,
                notes: JSON.stringify(ct, null, 4)
              })
            })
            AsyncStorage.setItem("@wzpr:Contacts", JSON.stringify([...contacts, ...newContacts]))
            setLoading(!isLoading)
          }
        })
      }
    )
  }

  const loadData = async () => {
    const data = JSON.parse(await Clipboard.getString())
    setContacts(data)
    const status = await AsyncStorage.setItem("@wzpr:Contacts", JSON.stringify(data));
    setLoading(!isLoading);
  }

  const merged = (contacts, contact) => { 
    return [...contacts.filter(item => item.id !== contact.id), contact] 
  }

  const checkContact = (contact) => {
    if (contact.checked) {
      setContacts(merged(contacts, {
        id: contact.id, 
        name: contact.name, 
        phone: contact.phone,
        notes: contact.notes
      }))
    } else {
      setContacts(merged(contacts, {
        id: contact.id, 
        name: contact.name, 
        phone: contact.phone, 
        notes: contact.notes, 
        checked: true 
      }))
    }
  }

  const saveJob = (job) => {
    AsyncStorage.setItem('@wzpr:Jobs', JSON.stringify([...jobs.filter(item => item.id !== job.id), job]));
    setLoading(!isLoading)
  }

  const deleteJob = (job) => {
    AsyncStorage.setItem('@wzpr:Jobs', JSON.stringify([...jobs.filter(item => item.id !== job.id)]))
    setLoading(!isLoading)    
  }

  const saveContact = (contact) => {
    console.log(contact.notes)
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
      text: JSON.stringify((contacts.filter(i => i.checked).length === 0 ? contacts : contacts.filter(i => i.checked)), null, 4),
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
    deleteJob,
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
