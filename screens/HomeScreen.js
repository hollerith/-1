import React, { useState, useEffect, useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { Alert, Button, Image, StatusBar, Text, TextInput, View } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import AddContactScreen from "./AddContactScreen"
import ContactListScreen from "./ContactListScreen"
import ContactDetailsScreen from "./ContactDetailsScreen"
import SendMessageScreen from "./SendMessageScreen"

import { UserContext } from "../contexts/UserProvider"
import { DataContext } from "../contexts/DataProvider"
import { ThemeContext } from "../contexts/ThemeProvider"

import { LogoTitle, SplashScreen, Masthead } from "../components"
import { 
  HeaderButtons, 
  HeaderButton, 
  Item, 
  HiddenItem, 
  OverflowMenu, 
  OverflowMenuProvider 
} from 'react-navigation-header-buttons'

const HomeStack = createStackNavigator();

export default function HomeScreen({ navigation }) {

  const { theme } = useContext(ThemeContext)
  const { menu } = useContext(UserContext);

  const { 
    contacts,
    selected,
    buncoSquad, 
    reloadContacts,
    deleteContacts, 
    syncData, 
    loadData, 
    sendSMS, 
    smsContacts, 
    msgContact 
  } = useContext(DataContext);

  const editContact = () => {
    if (selected().length > 0) {
      const { id, name, phone, notes, checked } = contacts.filter(item => item.id == selected()[0])[0]
      navigation.push('ContactDetails', { id, name, phone, notes, checked })
    } else {
      Alert.alert('Select some contact to edit')
    }    
  }

  const scheduleSMS = () => { 
    if (selected().length > 0) {
      navigation.navigate('Alerts', { screen: 'Schedule', params: selected()})
      //navigation.navigate("Schedule", selected())
    } else {
      Alert.alert('Select some contacts to message')
    }
  }

  return (
    <HomeStack.Navigator
      style={{ backgroundColor: "green"}}
      screenOptions={{
        headerShown: true,
        headerTitle: props => <LogoTitle {...props} />,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: theme.headerBackgroundColor,
        },
        headerTintColor: theme.headerTintColor,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => (
          <HeaderButtons HeaderButtonComponent={Masthead}>
            <OverflowMenu
              style={{ marginHorizontal: 10 }}
              OverflowIcon={<Icon name="account" size={32} color={theme.iconColor} />}
            >
              <HiddenItem title="Add" onPress={() => navigation.push("AddContact") }/>
              { selected().length > 0 ? 
                <>
                <HiddenItem title="Edit" onPress={editContact} />
                <HiddenItem title="Delete" onPress={deleteContacts} />
                <HiddenItem title="Share" onPress={msgContact} /> 
                </> :
                <>       
                <HiddenItem title="Edit" onPress={editContact} disabled />
                <HiddenItem title="Delete" onPress={deleteContacts} disabled />
                <HiddenItem title="Share" onPress={msgContact} disabled /> 
                </> }
              <HiddenItem title="Text" onPress={smsContacts} />
            </OverflowMenu>
            <OverflowMenu
              style={{ marginHorizontal: 10 }}
              OverflowIcon={<Icon name="menu" size={32} color={theme.iconColor} />}
            >
              <HiddenItem title="Paste" onPress={loadData} />
              <HiddenItem title="Sync" onPress={syncData} />
              { selected().length > 0 ? 
                <>
                <HiddenItem title="Schedule" onPress={scheduleSMS}/>
                <HiddenItem title="Clear" onPress={reloadContacts} />
                </> :
                <>       
                <HiddenItem title="Schedule" onPress={scheduleSMS} disabled/>
                <HiddenItem title="Clear" onPress={reloadContacts} disabled />
                </> }
                <HiddenItem title="Wipe" onPress={() => { buncoSquad(); menu.signOut() }} />
              <HiddenItem title="Sign Out" onPress={menu.signOut} />
            </OverflowMenu>
          </HeaderButtons>
        ),
      }} 
    >
      <HomeStack.Screen name="ContactList" component={ContactListScreen} options={{title: 'Home'}}  />
      <HomeStack.Screen name="ContactDetails" component={ContactDetailsScreen} options={{title: 'Contacts'}} />
      <HomeStack.Screen name="AddContact" component={AddContactScreen} options={{title: 'Add Contact'}} />
    </HomeStack.Navigator>
  )
}
