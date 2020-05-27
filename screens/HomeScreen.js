import React from 'react';
import { Button, Image, StatusBar, Text, TextInput, View } from "react-native";

import { createStackNavigator } from '@react-navigation/stack';

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import AddContactScreen from "./AddContactScreen";
import ContactListScreen from "./ContactListScreen";
import ContactDetailsScreen from "./ContactDetailsScreen";

import { LogoTitle, SplashScreen } from "../components"

import { 
  HeaderButtons, 
  HeaderButton, 
  Item, 
  HiddenItem, 
  OverflowMenu, 
  OverflowMenuProvider 
} from 'react-navigation-header-buttons';

import AuthContext from "../contexts/Auth"

const IoniconsHeaderButton = (props) => (
  <HeaderButton {...props} IconComponent={Icon} iconSize={32} color="grey" />
);

const HomeStack = createStackNavigator();

export default function HomeScreen({ navigation }) {
  const { signOut } = React.useContext(AuthContext);

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        headerTitle: props => <LogoTitle {...props} />,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTintColor: 'grey',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => (
          <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
            <Item title="Add" iconName="plus" onPress={() => navigation.navigate('AddContact')} />
            <OverflowMenu
              style={{ marginHorizontal: 10 }}
              OverflowIcon={<Icon name="menu" size={32} color="grey" />}
            >
              <HiddenItem title="hidden1" onPress={() => alert('hidden1')} />
              <HiddenItem title="hidden2" onPress={() => alert('hidden2')} />
              <HiddenItem title="hidden3" onPress={() => alert('hidden3')} />
              <HiddenItem title="Sign Out" onPress={signOut} />
            </OverflowMenu>
          </HeaderButtons>
        ),
      }} 
    >
      <HomeStack.Screen name="ContactList" component={ContactListScreen} options={{ title: "Home" }} />
      <HomeStack.Screen name="ContactDetails" component={ContactDetailsScreen} options={{ title: "Details" }} />
      <HomeStack.Screen name="AddContact" component={AddContactScreen} options={{ title: "Add Contact" }} />
    </HomeStack.Navigator>
  );
}
