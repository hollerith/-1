import React, { useState, useEffect, useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Alert, Button, Image, StatusBar, Text, TextInput, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import AddContactScreen from "./AddContactScreen";
import ContactListScreen from "./ContactListScreen";
import ContactDetailsScreen from "./ContactDetailsScreen";

import { LogoTitle, SplashScreen } from "../components"
import { UserContext } from "../contexts/UserProvider"
import { DataContext } from "../contexts/DataProvider"

import { 
  HeaderButtons, 
  HeaderButton, 
  Item, 
  HiddenItem, 
  OverflowMenu, 
  OverflowMenuProvider 
} from 'react-navigation-header-buttons';

const Masthead = (props) => (
  <HeaderButton {...props} IconComponent={Icon} iconSize={32} color="grey" />
);
const HomeStack = createStackNavigator();

export default function HomeScreen({ navigation }) {

  const { menu } = useContext(UserContext);
  const { 
    buncoSquad, 
    reloadContacts,
    deleteContacts, 
    syncData, 
    loadData, 
    smsContacts, 
    msgContact 
  } = useContext(DataContext);

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: props => <LogoTitle {...props} />,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTintColor: 'grey',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => (
          <HeaderButtons HeaderButtonComponent={Masthead}>
            <Item title="Add" iconName="plus" onPress={() => navigation.push("AddContact")} />
            <OverflowMenu
              style={{ marginHorizontal: 10 }}
              OverflowIcon={<Icon name="menu" size={32} color="grey" />}
            >
              <HiddenItem title="Add" onPress={() => navigation.push("AddContact") }/>
              <HiddenItem title="Clear" onPress={reloadContacts} />
              <HiddenItem title="Load" onPress={loadData} />
              <HiddenItem title="Sync" onPress={syncData} />
              <HiddenItem title="Text" onPress={smsContacts} />
              <HiddenItem title="Delete" onPress={deleteContacts} />
              <HiddenItem title="Share" onPress={msgContact} />
              <HiddenItem title="Bunco" onPress={buncoSquad} />
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
  );
}
