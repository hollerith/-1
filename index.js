// Contacts
import React from 'react';
import { Button, Image, StatusBar, Text, TextInput, View } from "react-native";
import { AsyncStorage } from "@react-native-community/async-storage";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Icon from "react-native-vector-icons/Ionicons";
import Ionicons from "react-native-vector-icons/Ionicons";

import AddContactScreen from "./screens/AddContactScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ContactListScreen from "./screens/ContactListScreen";
import ContactDetailsScreen from "./screens/ContactDetailsScreen";
import LoginScreen from "./screens/LoginScreen";

import { HeaderButtons, HeaderButton, Item, HiddenItem, OverflowMenu, OverflowMenuProvider } from 'react-navigation-header-buttons';

const ReusableSelectItem = ({ onPress }) => <Item title="Edit" onPress={onPress} />;
const ReusableHiddenItem = ({ onPress }) => <HiddenItem title="hidden2" onPress={onPress} />;

const IoniconsHeaderButton = (props) => (
  // the `props` here come from <Item ... />
  // you may access them and pass something else to `HeaderButton` if you like
  <HeaderButton {...props} IconComponent={Ionicons} iconSize={32} color="grey" />
);

const Stack = createStackNavigator()
const HomeStack = createStackNavigator();
const BottomTab = createBottomTabNavigator();
const AuthContext = React.createContext();

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require('./assets/logo.png')}
    />
  );
}

function SignInScreen({navigation}) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { signIn } = React.useContext(AuthContext);

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{
          borderWidth: 1,
          borderColor: 'black',
          minWidth: 100,
          marginTop: 50,
          marginHorizontal: 20,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 3,
        }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: 'black',
          minWidth: 100,
          marginTop: 20,
          marginHorizontal: 20,
          marginVertical: 50,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 3,
        }}
      />
      <Button title="Sign in" onPress={() => signIn({ username, password })} />
    </View>
  );
}

function HomeScreen({ navigation }) {
  const { signOut } = React.useContext(AuthContext);

  return (
    <HomeStack.Navigator
      screenOptions={{
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
            <Item title="Add" iconName="ios-contacts" onPress={() => navigation.navigate('AddContact')} />
            <OverflowMenu
              style={{ marginHorizontal: 10 }}
              OverflowIcon={<Ionicons name="ios-more" size={32} color="grey" />}
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

function MainTabs({ route, navigation }) {

  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'ios-square' : 'ios-square-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'md-settings' : 'ios-beer';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
        style: { height: 64 }
      }}>

      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Contacts',
        }}
      />

      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
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
                component={SignInScreen}
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
                        OverflowIcon={<Ionicons name="ios-more" size={32} color="grey" />}
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
                options={{ headerShown: false }}
              />
            )}
          </Stack.Navigator>
        </OverflowMenuProvider>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
