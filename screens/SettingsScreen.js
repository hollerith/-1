import React, { useState, useEffect, useContext } from 'react';
import { Alert, Button, Image, PermissionsAndroid, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import SendIntentAndroid from 'react-native-send-intent'
import Clipboard from "@react-native-community/clipboard"

import { UserContext } from "../contexts/UserProvider"
import SettingsForm from "../components/SettingsForm"

import { LogoTitle, SplashScreen } from "../components"
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

const MastHead = (props) => (
  <HeaderButton {...props} IconComponent={Icon} iconSize={32} color="grey" />
);

export default function SettingsScreen({ navigation }) {

  const { menu } = useContext(UserContext);
  const onPress = () => { navigation.push('AddContact') };

  return (
    <Stack.Navigator
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
          <HeaderButtons HeaderButtonComponent={MastHead}>
            <OverflowMenu
              style={{ marginHorizontal: 10 }}
              OverflowIcon={<Icon name="menu" size={32} color="grey" />}
            >
              <HiddenItem title="Bunco" onPress={() => alert('Bunco')} />
              <HiddenItem title="Sign Out" onPress={menu.signOut} />
            </OverflowMenu>
          </HeaderButtons>
        ),
      }}
    >
      <Stack.Screen name="Settings" component={SettingsForm} options={{title: 'Settings'}} />
    </Stack.Navigator>
  );
}
