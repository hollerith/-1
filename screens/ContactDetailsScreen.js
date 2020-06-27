import React, { useState, useEffect, useContext } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { UserContext } from "../contexts/UserProvider"
import { DataContext } from "../contexts/DataProvider"
import { ThemeContext } from "../contexts/ThemeProvider"

import { LogoTitle, SplashScreen } from "../components"
import { HeaderButtons, HeaderButton, Item, HiddenItem, OverflowMenu } from 'react-navigation-header-buttons'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Masthead = (props) => {
  const { theme } = useContext(ThemeContext)

  return (
    <HeaderButton {...props} IconComponent={Icon} iconSize={32} color={ theme.iconColor } />
  )
}

export default function ContactDetailsScreen({ route, navigation }) {

  const { id, name, phone, notes, checked } = route.params
  const { theme } = useContext(ThemeContext)
  const { user, isSignout, menu } = useContext(UserContext)
  const { deleteContacts, saveContact, callContact, smsContact } = useContext(DataContext)

  const [state, setState] = useState({ name: name, phone: phone, notes: notes})

  const onPressSMS = () => {
    navigation.navigate('SendMessage', { id, name, phone, checked });
  };

  const onPressCall = () => {
    callContact({ phone });
    navigation.navigate('ContactList')
  }

  const onPressText = () => {
    smsContact({ phone });
    navigation.navigate('ContactList')
  }

  const onPressDelete = () => {
    deleteContacts({ id });
    navigation.navigate('ContactList')
  }

  const onPressSignOut = () => {
    menu.signOut()
  }

  const onPressSave = () => {
    saveContact({ id: id, name: state.name, phone: state.phone, notes: state.notes})
    navigation.navigate('ContactList')
  }

  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      flex: 1
    },
    textinput: {
      fontSize: 24,
      color: theme.textColor,
      borderWidth: 1,
      borderColor: theme.borderColor,
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

  navigation.setOptions({
    title: '',
    headerTitle: props => <LogoTitle {...props} />,
    headerTitleAlign: "center",
    headerStyle: {
      backgroundColor: theme.headerBackgroundColor,
    },
    headerTintColor: theme.headerTintColor,
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={Masthead}>
         <Item title="Call" iconName="phone" onPress={onPressCall} />
         <OverflowMenu
          style={{ marginHorizontal: 10 }}
          OverflowIcon={<Icon name="menu" size={32} color="grey" />}
        >
          <HiddenItem title="Call" onPress={onPressCall} />
          <HiddenItem title="Text" onPress={onPressText} />
          <HiddenItem title="Schedule" onPress={onPressSMS} />
          <HiddenItem title="Delete" onPress={onPressDelete} />
          <HiddenItem title="SignOut" onPress={onPressSignOut} />
        </OverflowMenu>
      </HeaderButtons>
    ),
    animationTypeForReplace: { isSignout } ? 'pop' : 'push',
  })

  return (
    <ScrollView style={{padding: 20, flex: 1, backgroundColor: theme.backgroundColor}}>
      <TextInput
        style={ styles.textinput }
        value={state.name}
        onChangeText={data => setState({...state, name: data }) }
      />
      <TextInput
        style={ styles.textinput }
        value={state.phone}
        onChangeText={data => setState({...state, phone: data }) }
      />
      <TextInput
        style={[ styles.textinput, { 
          textAlign: "center", 
          fontSize: 18,
          fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace'
        }]}
        value={state.notes}
        onChangeText={data => setState({...state, notes: data }) }
        placeholder="Enter notes"
        multiline = {true}
        numberOfLines = {5}
      />
     <View style={{margin:20}} />
      <Button title="Save" onPress={onPressSave} />
    </ScrollView>
  );
}
