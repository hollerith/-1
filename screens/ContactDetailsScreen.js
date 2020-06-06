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
  const { id, name, phone } = route.params;
  const { user, isSignout, menu } = useContext(UserContext);
  const { deleteContact } = useContext(DataContext);

  const onPress = () => {
    console.log("ContactDetailsScreen::onPress")
    deleteContact({ id });
    navigation.navigate('ContactList')
  }
  
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
         <Item title="Del" iconName="delete" onPress={onPress} />
         <OverflowMenu
          style={{ marginHorizontal: 10 }}
          OverflowIcon={<Icon name="menu" size={32} color="grey" />}
        >
          <HiddenItem title="SignOut" onPress={menu.signOut} />
        </OverflowMenu>
      </HeaderButtons>
    ),
    animationTypeForReplace: { isSignout } ? 'pop' : 'push',
  })

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
