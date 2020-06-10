import React, { createContext, useState, useEffect, useReducer, useMemo } from "react";
import AsyncStorage from '@react-native-community/async-storage'

const UserContext = createContext();
const { Provider } = UserContext;

const UserProvider = props => {

  const [user, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          console.log(`Restoring state ${JSON.stringify(action)}`);
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
            username: action.username,
          };
        case 'SIGN_UP':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            username: action.username,
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
      username: "",
    }
  );

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem("userToken");
        dispatch({ type: 'RESTORE_TOKEN', token: userToken });
      } catch (e) {
        console.log(`index.js :: Restoring token failed ${e.message}`);
      }
    };

    bootstrapAsync();
  }, []);

  const menu = useMemo(
    () => ({
      signIn: async (data) => {
        // TODO: validate login details
        const login = await AsyncStorage.getItem('username')
        console.log(`Login : ${login}`)
        if (login == data.username) {
          await AsyncStorage.setItem("userToken", "dummy-auth-token");
          dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token', username: login });
        }
      },
      signOut: async () => {
        await AsyncStorage.removeItem("userToken");
        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async data => {
        // TODO: create account
        dispatch({ type: 'SIGN_UP', username: data.username });
        await AsyncStorage.setItem("username", data.username);
      },
    }),
    []
  );

  const isSignout = user.isSignout
  const userContext = { user, menu, isSignout }

  return <Provider value={ userContext }>{props.children}</Provider>;
};

export { UserProvider, UserContext };
