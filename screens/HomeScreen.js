import React from 'react';
import { Alert, Button, Image, StatusBar, Text, TextInput, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { createStackNavigator } from '@react-navigation/stack';

import AuthContext from "../contexts/Auth"
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

const IoniconsHeaderButton = (props) => (
  <HeaderButton {...props} IconComponent={Icon} iconSize={32} color="grey" />
);
const HomeStack = createStackNavigator();

export default function HomeScreen({ navigation }) {

  const { signOut } = React.useContext(AuthContext);
  const onPress = () => { navigation.push('AddContact') };

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: true,
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
            <Item title="Add" iconName="plus" onPress={onPress} />
            <OverflowMenu
              style={{ marginHorizontal: 10 }}
              OverflowIcon={<Icon name="menu" size={32} color="grey" />}
            >
              <HiddenItem title="Add" onPress={onPress} />
              <HiddenItem title="Edit" onPress={() => Alert.alert('Edit Contact')} />
              <HiddenItem title="Delete" onPress={() => alert('Delete Contact')} />
              <HiddenItem title="Copy" onPress={() => alert('Copy Contact')} />
              <HiddenItem title="Bunco" onPress={() => alert('Bunco')} />
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
