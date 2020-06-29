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

import SettingsForm from "../components/SettingsForm"
import ProfileScreen from "../screens/ProfileScreen"
import ThemesForm from "../components/SelectTheme"

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

export default function SettingsScreen({ navigation }) {

  const { theme } = useContext(ThemeContext);
  const { menu } = useContext(UserContext);

  const onProfile = () => { navigation.push('Profile') };
  const onThemes = () => { navigation.push('Themes') };
  const onJobs = () => { 
    navigation.push('Jobs')
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
              <HiddenItem title="Profile" onPress={onProfile} />
              <HiddenItem title="Themes" onPress={onThemes} />
              <HiddenItem title="Jobs" onPress={onJobs} />
              <HiddenItem title="Wipe" onPress={() => { buncoSquad(); menu.signOut() }} />
              <HiddenItem title="Sign Out" onPress={menu.signOut} />
            </OverflowMenu>
          </HeaderButtons>
        ),
      }}
    >
      <Stack.Screen name="Settings" component={SettingsForm} options={{title: 'Settings'}} />
      <Stack.Screen name="Themes" component={ThemesForm} options={{title: 'Themes'}} />
      <Stack.Screen name="Profile" component={ProfileScreen} initialParams={{ banner: "Profile"}} options={{title: 'Profile'}} />
    </Stack.Navigator>
  );
}
