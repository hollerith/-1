import React, { useState, useEffect, useContext } from "react";
import AsyncStorage from '@react-native-community/async-storage';
import { DataContext } from "../contexts/DataProvider";

import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
  Platform
} from 'react-native';

const phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im

const AddContactForm = ({ navigation }) => {

  const { addContact } = useContext(DataContext);

  const [state, setState] = useState({
    name: "",
    phone: "",
    isFormValid: false,
  });

  useEffect(() => {
    console.log(`On change state.name or state.phone ${JSON.stringify(state)}`);
    validateForm();
  }, [state.name, state.phone]);

  const onPress = () => {
    const newContact = { id: new Date().getTime().toString(), name: state.name, phone: state.phone };
    addContact(newContact);
    navigation.navigate('ContactList');
  };

  const getHandler = key => val => {
    setState({...state, [key]: val });
  };

  const validateForm = () => {
    if (state.phone.match(phoneno) && state.name.length > 0) {
      setState({...state, isFormValid: true });
    } else {
      setState({...state, isFormValid: false });
    }
    return state.isFormValid
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.container}>
      <View style={{ padding: 20 }}>
        <TextInput
          style={styles.textinput}
          value={state.name}
          onChangeText={getHandler('name')}
          placeholder="Name"
        />
        <TextInput
          keyboardType="numeric"
          style={styles.textinput}
          value={state.phone}
          onChangeText={getHandler('phone')}
          placeholder="Phone"
        />
        <View style={{ margin: 20 }}/>
        <Button
          title="Submit"
          onPress={onPress}
          disabled={!state.isFormValid}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddContactForm;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1
  },
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
    marginVertical: 10,
    borderRadius: 3,
  },
  text: {
    textAlign: "center"
  }
});

