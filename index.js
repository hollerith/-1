// Contacts
import React, { useState, useEffect, useContext } from 'react';
import { Button, Image, StatusBar, Text, TextInput, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import SettingsScreen from "./screens/SettingsScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";

import AsyncStorage from '@react-native-community/async-storage'
import { DataProvider } from "./contexts/DataProvider"
import { UserProvider, UserContext } from "./contexts/UserProvider"

import { LogoTitle, SplashScreen } from "./components"
import { HeaderButtons, HeaderButton, Item, HiddenItem, OverflowMenu, OverflowMenuProvider } from 'react-navigation-header-buttons';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Masthead = (props) => (
  <HeaderButton {...props} IconComponent={Icon} iconSize={32} color="grey" />
);

const Stack = createStackNavigator()
const HomeStack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

function BottomTabs({ route, navigation }){
  
  return (
    <DataProvider>
      <BottomTab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            size = 32;
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Settings') {
              iconName = 'tune';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
          inactiveBackgroundColor: 'lightgray',
          style: { height: 72 }
        }}>
        <BottomTab.Screen name="Home" component={HomeScreen} />
        <BottomTab.Screen name="Settings" component={SettingsScreen} />
      </BottomTab.Navigator>
    </DataProvider>
  )
}

function Main({ route, navigation }){

  const { user, menu } = useContext(UserContext);
  const isSignout = user.isSignout;

  return (
    <Stack.Navigator>
      {user.isLoading // We haven't finished checking for the token yet
        ? (<Stack.Screen name="Splash" component={SplashScreen} />) 
        : user.userToken == null // No token found, user isn't signed in
          ? user.username
            ? (<Stack.Screen name="SignIn" component={ LoginScreen } />) 
            : (<Stack.Screen name="SignUp" component={ SignUpScreen } />)
          : (<Stack.Screen name="BottomTabs" component={ BottomTabs } options={{ headerShown: false }} />) 
      }
    </Stack.Navigator>
  )
}

export default function App() {
  
  return (
    <UserProvider>
      <NavigationContainer>
        <OverflowMenuProvider>
          <Main/>
        </OverflowMenuProvider>
      </NavigationContainer>
    </UserProvider>
  );
}
