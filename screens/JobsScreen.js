import React, { useState, useEffect, useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import SendIntentAndroid from 'react-native-send-intent'
import Clipboard from "@react-native-community/clipboard"
import { 
  Alert, 
  Button, 
  Image, 
  PermissionsAndroid, 
  ScrollView, 
  StatusBar, 
  StyleSheet, 
  Text, 
  TextInput, 
  View 
} from "react-native";

import { ThemeContext } from "../contexts/ThemeProvider"
import { UserContext } from "../contexts/UserProvider"

import JobsListScreen from "../screens/JobsListScreen"
import SendMessageScreen from "../screens/SendMessageScreen"
import SetReminderScreen from "../screens/SetReminderScreen"

import { LogoTitle, SplashScreen, Masthead } from "../components"
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  HeaderButtons,
  HeaderButton,
  Item,
  HiddenItem,
  OverflowMenu,
  OverflowMenuProvider
} from 'react-navigation-header-buttons';

const Stack = createStackNavigator();

export default function JobsScreen({ navigation }) {

  const { theme } = useContext(ThemeContext);
  const { menu } = useContext(UserContext);

  const onMessage = () => { 
    navigation.navigate('Schedule', {action: 'message'}) 
  };
  const onReminder = () => {     
    navigation.navigate('Reminder', {action: 'alert'})
  };
  const onAlarm = () => { 
    navigation.navigate('Reminder', {action: 'alarm'})
  };

  return (
    <Stack.Navigator
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
              OverflowIcon={<Icon name="menu" size={32} color={ theme.iconColor } />}
            >
              <HiddenItem title="Message" onPress={onMessage} />
              <HiddenItem title="Reminder" onPress={onReminder} />
              <HiddenItem title="Alarm" onPress={onAlarm} />
              <HiddenItem title="Sign Out" onPress={menu.signOut} />
            </OverflowMenu>
          </HeaderButtons>
        ),
      }}
    >
      <Stack.Screen name="Jobs" component={JobsListScreen} options={{title: 'Jobs'}} />
      <Stack.Screen name="Schedule" component={SendMessageScreen} options={{title: 'Message'}} />
      <Stack.Screen name="Reminder" component={SetReminderScreen} options={{title: 'Reminder'}} />
      <Stack.Screen name="Alarm" component={SetReminderScreen} options={{title: 'Alarm'}} />
    </Stack.Navigator>
  );
}
