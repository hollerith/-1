import React, { useState, useEffect, useContext } from 'react';
import { Button, ScrollView, StyleSheet, View, Text, TextInput } from "react-native";

import { LogoTitle, SplashScreen } from "../components"
import { HeaderButtons, HeaderButton, Item, HiddenItem, OverflowMenu } from 'react-navigation-header-buttons';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Masthead = (props) => (
  <HeaderButton {...props} IconComponent={Icon} iconSize={32} color="grey" />
);

import { UserContext } from "../contexts/UserProvider"

export default function LoginScreen({route, navigation}) {
  const { user, menu } = useContext(UserContext);

  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState('P455w0rd.');

  const onPress = () => {
    console.log(`Sign in ${username}`);
    menu.signIn({ username, password });
  }

  const isSignout = user.isSignout;

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
          <HiddenItem title="Register" onPress={menu.signUp} />
        </OverflowMenu>
      </HeaderButtons>
    ),
    animationTypeForReplace: { isSignout } ? 'pop' : 'push',
  })

  return (
    <ScrollView style={{padding: 20}}>
      <Text 
          style={ styles.banner }>
          Welcome
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
      <Button title="Sign in" onPress={ onPress } />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  banner: {
    fontSize: 48, 
    fontFamily: "Lobster-Regular",
    textAlign: "center",
    color: "tomato"
  },
  textinput: {
    fontSize: 24, 
    borderWidth: 1,
    borderColor: 'lightgrey',
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

