import React, { useState, useEffect, useContext } from 'react';
import { Alert, Button, ScrollView, StyleSheet, View, Text, TextInput } from "react-native";

import { LogoTitle, SplashScreen, Masthead } from "../components"
import { HeaderButtons, HeaderButton, Item, HiddenItem, OverflowMenu } from 'react-navigation-header-buttons';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { ThemeContext } from "../contexts/ThemeProvider"
import { UserContext } from "../contexts/UserProvider"

export default function SignUpScreen({route, navigation}) {

  const { banner } = route.params

  const { theme } = useContext(ThemeContext)
  const { user, menu } = useContext(UserContext)

  const initialPassword = ( banner == "Register" ? "P455w0rd." : "")

  const [username, setUsername] = useState(( banner == "Register" ? "" : user.username))
  const [oldpass, setOldPass] = useState(initialPassword);
  const [password, setPassword] = useState(initialPassword);

  const onPress = async () => {
    await menu.setIsLoading()
    changeProfile()
  }

  const changeProfile = async () => {

    if (banner == 'Register') {
      if (oldpass == password) {
        menu.signUp({ username: username, oldpass: oldpass, password: password})
      } else {
        Alert.alert('Passwords are not the same!')         
      }
      return
    }

    if (username !== user.username) {
      menu.changeUser({ username: username })
      Alert.alert(`Username changed to ${username}\nPlease login`)
    } 

    if (oldpass && password) {
      if (banner != 'Register') {
        menu.changePass({ username: username, oldpass: oldpass, password: password})
      }
    } else {
      if (oldpass || password) {
        Alert.alert('Please enter both OLD password and desired NEW password') 
      }
    }
  }

  const isSignout = user.isSignout;

  const styles = StyleSheet.create({
    banner: {
      fontSize: 48, 
      fontFamily: theme.bannerFontFamily,
      textAlign: "center",
      color: theme.activeTintColor
    },
    textinput: {
      fontSize: 24, 
      borderWidth: 1,
      borderColor: theme.borderColor,
      minWidth: 100,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 3,
    },
    password: {
//      marginTop: 10,
    }
  });

  navigation.setOptions({ 
    headerShown: banner == "Register" ? false : true,
    title: '',
    headerTitle: props => <LogoTitle {...props} />,
    headerTitleAlign: "center",
    headerStyle: {
      backgroundColor: 'white',
    },
    headerTintColor: 'gray',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={Masthead}>
        <OverflowMenu
          style={{ marginHorizontal: 10 }}
          OverflowIcon={<Icon name="menu" size={32} color={theme.inactiveTintColor} />}
        >
          <HiddenItem title="Sign Out" onPress={() => menu.signOut() } />
        </OverflowMenu>
      </HeaderButtons>
    ),
    animationTypeForReplace: { isSignout } ? 'pop' : 'push',
  })

  return (
    <ScrollView style={{padding: 20, backgroundColor: theme.backgroundColor}}>
      <Text 
          style={ styles.banner }>
          { banner || "Register" }
      </Text>
      <View style={{margin:20}} />
      <TextInput
        placeholder={ banner == 'Register' ? "Username" : "Change username" }
        value={username}
        onChangeText={setUsername}
        style={ styles.textinput }
      />
      <View style={{ margin:5 }}/>
      <TextInput
        placeholder={ banner == 'Register' ? "Password" : "Old password" }
        value={oldpass}
        onChangeText={setOldPass}
        secureTextEntry
        style={[styles.textinput, styles.password ]}
      />
      <View style={{ margin:5 }}/>
      <TextInput
        placeholder={ banner == 'Register' ? "Confirm Password" : "New password" }
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.textinput, styles.password ]}
      />
      <View style={{ margin:5 }}/>
      <Button title={ banner == 'Register' ? "Sign Up" : "Save"}  onPress={ onPress } />
    </ScrollView>
  );
}
