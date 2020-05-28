import React, { useState, useEffect } from 'react';
import { Button, View, StyleSheet } from 'react-native';
import SectionListContacts from '../components/SectionListContacts';
import contacts from "../utils/contacts";

export default function ContactListScreen ({ route, navigation }) {

  handleSelectContact = contact => {
    navigation.push('ContactDetails', contact);
  };

  return (
    <View style={styles.container}>
      <SectionListContacts contacts={ contacts } onSelectContact={ handleSelectContact } />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
