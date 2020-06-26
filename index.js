// Contacts
import React, { useState, useEffect, useContext } from 'react';
import { Button, Image, StatusBar, Text, TextInput, View, NativeModules } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import SettingsScreen from "./screens/SettingsScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HomeScreen from "./screens/HomeScreen";

import AsyncStorage from '@react-native-community/async-storage'

import { UserProvider, UserContext } from "./contexts/UserProvider"
import { ThemeProvider, ThemeContext } from "./contexts/ThemeProvider"
import { DataProvider } from "./contexts/DataProvider"

import { LogoTitle, SplashScreen } from "./components"
import { 
  HeaderButtons, 
  HeaderButton, 
  Item, 
  HiddenItem, 
  OverflowMenu, 
  OverflowMenuProvider 
} from 'react-navigation-header-buttons';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import BackgroundTimer from 'react-native-background-timer';

// Local datetime adjusted string
function displayTime() {
  const d = new Date()
  const z = n => n.toString().length == 1 ? `0${n}` : n // Zero pad
  return `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}`
}

function addMinutes(date, minutes) { return new Date(date.getTime() + minutes*60000); }

const DirectSms = NativeModules.DirectSms

const Stack = createStackNavigator()
const HomeStack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

function BottomTabs({ route, navigation }){

  const { theme } = useContext(ThemeContext);

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
          activeTintColor: theme.activeTintColor,
          activeBackgroundColor: theme.activeBackgroundColor,
          inactiveTintColor: theme.inactiveTintColor,
          inactiveBackgroundColor: theme.inactiveBackgroundColor,
          style: { height: 56 }
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
        ? (<Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: true, headerTitle: "Loading wzpr..."}} />) 
        : user.userToken == null // No token found, user isn't signed in
          ? user.username
            ? (<Stack.Screen name="SignIn" component={ LoginScreen } />) 
            : (<Stack.Screen name="SignUp" component={ ProfileScreen } initialParams={{ banner: "Register"}} />)
          : (<Stack.Screen name="BottomTabs" component={ BottomTabs } options={{ headerShown: false }} />) 
      }
    </Stack.Navigator>
  )
}

export default function App() {

  // Fork the background timer to run jobs
  useEffect(() => {
    (async () => {

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
            console.log(`\x1b[34mSending SMS to ${job.to.toString()}\x1b[0m`)
            DirectSms.sendDirectSms(job.to.toString(), job.text);
            if (job.repeat != "once") {
              switch (job.repeat) {
                case 'month':
                  date = new Date()
                  job.schedule = new Date(date.setMonth(date.getMonth()+1));
                  break;
                case 'quarter':
                  job.schedule = new Date(date.setMonth(date.getMonth()+3));
                  break;
                case 'year':
                  job.schedule = new Date(date.setMonth(date.getMonth()+12));
                  break;
                default:
                  job.schedule = addMinutes(new Date(), +job.repeat)
                  break;
              }
              backlog.push(job) // push updated job back on the queue
            }
          } else {
            backlog.push(job)
          }
        })
        AsyncStorage.setItem('@wzpr:Jobs', JSON.stringify(backlog))

      }, 30000);

    })();
  }, []);
 
  return (
    <ThemeProvider>
      <UserProvider>
        <NavigationContainer>
          <OverflowMenuProvider>
            <Main/>
          </OverflowMenuProvider>
        </NavigationContainer>
      </UserProvider>
    </ThemeProvider>
  );
}
