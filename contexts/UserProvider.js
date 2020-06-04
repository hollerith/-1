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
        // TODO: login details
        await AsyncStorage.setItem("userToken", "dummy-auth-token");
        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: async () => {
        await AsyncStorage.removeItem("userToken");
        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async data => {
        // TODO: create account
        dispatch({ type: 'SIGN_UP', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  const userContext = { user, menu }

  return <Provider value={ userContext }>{props.children}</Provider>;
};

export { UserProvider, UserContext };
