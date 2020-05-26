import React from 'react';
import { Button, Text, View } from 'react-native';

export default function ContactDetailsScreen({ route, navigation }) {
  const { name } = route.params;
  const { phone } = route.params;
  const { contacts } = route.params;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Text>name: {JSON.stringify(name)}</Text>
      <Text>phone: {JSON.stringify(phone)}</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('ContactList')} />
    </View>
  );
}
