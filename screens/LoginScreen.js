import React from "react";
import { Button, View, TextInput } from "react-native";
import AuthContext from "../contexts/Auth"

export default function LoginScreen({navigation}) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { signIn } = React.useContext(AuthContext);

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{
          borderWidth: 1,
          borderColor: 'black',
          minWidth: 100,
          marginTop: 50,
          marginHorizontal: 20,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 3,
        }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: 'black',
          minWidth: 100,
          marginTop: 20,
          marginHorizontal: 20,
          marginVertical: 50,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 3,
        }}
      />
      <Button title="Sign in" onPress={() => signIn({ username, password })} />
    </View>
  );
}


