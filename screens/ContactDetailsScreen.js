import React from 'react';
import { Button, ScrollView, Text, View } from 'react-native';

export default function ContactDetailsScreen({ route, navigation }) {
  const { name, phone } = route.params;

  return (
    <ScrollView style={{padding: 20}}>
      <Text style={{fontSize: 27}}>
        { name }
      </Text>
      <Text style={{fontSize: 27}}>
        { phone }
      </Text>
      <View style={{margin:20}} />
      <Button title="Go to Home" onPress={() => navigation.navigate('ContactList')} />
    </ScrollView>
  );
}
