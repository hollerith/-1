// Contacts
import React from 'react';
import { Button, Image, StatusBar, Text, TextInput, View } from "react-native";
import { AsyncStorage } from "@react-native-community/async-storage";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import SettingsScreen from "./screens/SettingsScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";

import { LogoTitle, SplashScreen } from "./components"
import { HeaderButtons, HeaderButton, Item, HiddenItem, OverflowMenu, OverflowMenuProvider } from 'react-navigation-header-buttons';

import AuthContext from "./contexts/Auth"

const IoniconsHeaderButton = (props) => (
  <HeaderButton {...props} IconComponent={Icon} iconSize={32} color="grey" />
);

const Stack = createStackNavigator()
const HomeStack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

function MainTabs({ route, navigation }) {

  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          size = 32;
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Settings') {
            iconName = 'tune';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
        inactiveBackgroundColor: 'lightgray',
        style: { height: 72 }
      }}>

      <BottomTab.Screen name="Home" component={HomeScreen} />
      <BottomTab.Screen name="Settings" component={SettingsScreen} />
    </BottomTab.Navigator>
  );
}

export default function App({ navigation }) {

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log(`index.js :: Restoring token failed ${e.message}`);
      }
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        // TODO: login details
        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async data => {
        // TODO: create account
        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <OverflowMenuProvider>
          <Stack.Navigator>
            {state.isLoading ? (
              // We haven't finished checking for the token yet
              <Stack.Screen name="Splash" component={SplashScreen} />
            ) : state.userToken == null ? (
              // No token found, user isn't signed in
              <Stack.Screen
                name="SignIn"
                component={LoginScreen}
                options={{
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
                    <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
                      <OverflowMenu
                        style={{ marginHorizontal: 10 }}
                        OverflowIcon={<Icon name="menu" size={32} color="grey" />}
                      >
                        <HiddenItem title="Sign up" onPress={authContext.signUp} />
                        <HiddenItem title="Sign In" onPress={authContext.signIn} />
                      </OverflowMenu>
                    </HeaderButtons>
                  ),
                  animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                }}
              />
            ) : (
              // User is signed in
              <Stack.Screen 
                name="Main" 
                component={MainTabs} 
                options={{
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
                      <Item title="Add" iconName="plus" onPress={() => navigation.navigate('AddContact')} />
                      <OverflowMenu
                        style={{ marginHorizontal: 10 }}
                        OverflowIcon={<Icon name="menu" size={32} color="grey" />}
                      >
                        <HiddenItem title="hidden1" onPress={() => alert('hidden1')} />
                        <HiddenItem title="hidden2" onPress={() => alert('hidden2')} />
                        <HiddenItem title="hidden3" onPress={() => alert('hidden3')} />
                        <HiddenItem title="Sign Out" onPress={authContext.signOut} />
                      </OverflowMenu>
                    </HeaderButtons>
                  ),
                }} 
              />
            )}
          </Stack.Navigator>
        </OverflowMenuProvider>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
