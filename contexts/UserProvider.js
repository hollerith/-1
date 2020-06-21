import React, { createContext, useState, useEffect, useReducer, useMemo } from "react";
import AsyncStorage from '@react-native-community/async-storage'
import bcrypt from "react-native-bcrypt"
import isaac from "isaac"
import { Alert } from "react-native"

const UserContext = createContext();
const { Provider } = UserContext;

bcrypt.setRandomFallback((len) => {
	const buf = new Uint8Array(len);
	return buf.map(() => Math.floor(isaac.random() * 256));
});

const UserProvider = props => {

  const [user, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            username: action.username,
            isLoading: false,
          }
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            username: action.username,
            isLoading: false
          }
        case 'SIGN_UP':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            username: action.username,
            isLoading: false
          }
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          }
        case 'FAIL_TOKEN':
          return {
            ...prevState,
            isLoading: false,
            username: action.username,
          }
        case 'IS_LOADING':
          return {
            ...prevState,
            isLoading: true,
          }
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      username: "",
      userhash: "",
    }
  );

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken, account
      try {
        account = JSON.parse(await AsyncStorage.getItem("@wzpr:account"))
        if (account) {
          userToken = await AsyncStorage.getItem("@wzpr:userToken")
          if (userToken) {
            return dispatch({ type: 'RESTORE_TOKEN', token: userToken, username: account.login})
          } else {
            return dispatch({ type: 'FAIL_TOKEN', username: account.login})
          }
        }
        return dispatch({ type: 'FAIL_TOKEN', username: ""})
      } catch (e) {
        dispatch({ type: 'FAIL_TOKEN', username: ""})
      }
    }

    bootstrapAsync()
  }, []);

  // menu of actions
  const menu = useMemo(
    () => ({
      signIn: async (input) => {
        // TODO: validate login details
        const account = JSON.parse(await AsyncStorage.getItem('@wzpr:account'))
        if (input.username == account.login && bcrypt.compareSync(input.password, account.userhash)) {
          await AsyncStorage.setItem("@wzpr:userToken", "dummy-auth-token");
          dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token', username: account.login });
        } else {
          Alert.alert('Wrong user or bad password')
        }
      },
      setIsLoading: () => {
        dispatch({ type: 'IS_LOADING' });
      },
      signOut: async () => {
        await AsyncStorage.removeItem("userToken");
        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async input => {
        if (input.oldpass == input.password) {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(input.password, salt);
          dispatch({ type: 'SIGN_UP', username: input.username });
          await AsyncStorage.setItem("@wzpr:account", JSON.stringify({ login: input.username, userhash: hash}));
          dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token', username: input.username });
        } else {
          Alert.alert(`Passwords don\'t match:\n`)
        }
      },
      changeUser: async input => {
        dispatch({ type: 'SIGN_UP', username: input.username });
        const account = JSON.parse(await AsyncStorage.getItem('@wzpr:account'))
        await AsyncStorage.setItem("@wzpr:account", JSON.stringify({ ...account, login: input.username}));
      },
      changePass: async input => {
        const account = JSON.parse(await AsyncStorage.getItem('@wzpr:account'))
        if (input.username == account.login && bcrypt.compareSync(input.oldpass, account.userhash)) {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(input.password, salt);
          dispatch({ type: 'SIGN_UP', username: input.username, userhash: hash });
          await AsyncStorage.setItem("@wzpr:account", JSON.stringify({ ...account, userhash: hash}));
        } else {
          Alert.alert(`Enter current password`)
        }
      },
    }),
    []
  );

  const isSignout = user.isSignout
  const userContext = { user, menu, isSignout }

  return <Provider value={ userContext }>{props.children}</Provider>;
};

export { UserProvider, UserContext };
