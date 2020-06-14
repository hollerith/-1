import React, { useState, useEffect, useContext } from 'react';
import { Button, ScrollView, StyleSheet, View, Text, TextInput } from "react-native";

import { LogoTitle, SplashScreen, Masthead } from "../components"
import { HeaderButtons, HeaderButton, Item, HiddenItem, OverflowMenu } from 'react-navigation-header-buttons';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { ThemeContext } from "../contexts/ThemeProvider"
import { UserContext } from "../contexts/UserProvider"

export default function LoginScreen({route, navigation}) {
  const { theme } = useContext(ThemeContext)
  const { user, menu } = useContext(UserContext)

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState('P455w0rd.');

  const onPress = () => {
    console.log(`Sign up with ${username}`);
    menu.signUp({ username, password });
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
      marginTop: 10,
      marginVertical: 50,
    }
  });

  navigation.setOptions({ 
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
          OverflowIcon={<Icon name="menu" size={32} color="grey" />}
        >
          <HiddenItem title="Sign In" onPress={() => navigation.navigate('LoginScreen')} />
        </OverflowMenu>
      </HeaderButtons>
    ),
    animationTypeForReplace: { isSignout } ? 'pop' : 'push',
  })

  return (
    <ScrollView style={{padding: 20, backgroundColor: theme.backgroundColor}}>
      <Text 
          style={ styles.banner }>
          Register
      </Text>
      <View style={{margin:20}} />
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={ styles.textinput }
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.textinput , styles.password ]}
      />
      <Button title="Sign Up" onPress={ onPress } />
    </ScrollView>
  );
}
