import React, { useState, useEffect, useContext } from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
import { UserContext } from "../contexts/UserProvider"
import { DataContext } from "../contexts/DataProvider"

import { LogoTitle, SplashScreen } from "../components"
import { HeaderButtons, HeaderButton, Item, HiddenItem, OverflowMenu } from 'react-navigation-header-buttons'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Masthead = (props) => (
  <HeaderButton {...props} IconComponent={Icon} iconSize={32} color="grey" />
);

export default function ContactDetailsScreen({ route, navigation }) {
  const { id, name, phone, checked } = route.params;
  const { user, isSignout, menu } = useContext(UserContext);
  const { deleteContacts, callContact, smsContact } = useContext(DataContext);

  const onPressCall = () => {
    console.log("ContactDetailsScreen::onPressCall")
    callContact({ phone });
    navigation.navigate('ContactList')
  }

  const onPressText = () => {
    console.log("ContactDetailsScreen::onPressText")
    smsContact({ phone });
    navigation.navigate('ContactList')
  }

  const onPressDelete = () => {
    console.log("ContactDetailsScreen::onPressDelete")
    deleteContacts({ id });
    navigation.navigate('ContactList')
  }

  const onPressSignOut = () => {
    console.log("ContactDetailsScreen::onPressSignOut")
    menu.signOut()
  }

  const onPressHome = () => {
    console.log("ContactDetailsScreen::onPressSignHome")
    navigation.navigate('ContactList')
  }

  useEffect(() => {
    console.log(`ContactDetailsScreen::On first render `);
    console.log(`  ~> route.params -${JSON.stringify(route.params)}`);
  }, []);

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
         <Item title="Call" iconName="phone" onPress={onPressCall} />
         <Item title="Del" iconName="delete" onPress={onPressDelete} />
         <OverflowMenu
          style={{ marginHorizontal: 10 }}
          OverflowIcon={<Icon name="menu" size={32} color="grey" />}
        >
          <HiddenItem title="Call" onPress={onPressCall} />
          <HiddenItem title="Text" onPress={onPressText} />
          <HiddenItem title="Delete" onPress={onPressDelete} />
          <HiddenItem title="SignOut" onPress={onPressSignOut} />
        </OverflowMenu>
      </HeaderButtons>
    ),
    animationTypeForReplace: { isSignout } ? 'pop' : 'push',
  })

  return (
    <ScrollView style={{padding: 20, flex: 1}}>
      <Text style={{fontSize: 27}}>
        { name }
      </Text>
      <Text style={{fontSize: 27}}>
        { phone }
      </Text>
      <View style={{margin:20}} />
      <Button title="Go to Home" onPress={onPressHome} />
    </ScrollView>
  );
}
