import React from "react";
import { Button, ScrollView, StyleSheet, View, Text, TextInput } from "react-native";
import AuthContext from "../contexts/Auth"

export default function LoginScreen({route, navigation}) {
  const [username, setUsername] = React.useState('testuser');
  const [password, setPassword] = React.useState('P455w0rd.');

  const { signIn } = React.useContext(AuthContext);

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
        style={[ styles.textinput, styles.username ]}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.textinput , styles.password ]}
      />
      <Button title="Sign in" onPress={() => signIn({ username, password })} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  banner: {
    fontSize: 36, 
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
  username: {
    marginTop: 50
  },
  password: {
    marginTop: 10,
    marginVertical: 50,
  }
});

