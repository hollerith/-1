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
            username: "",
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
      console.log('\x1b[33m Booting::\x1b[34mUser Context\x1b[0m')
      let userToken, account
      try {
        userToken = await AsyncStorage.getItem("userToken")
        console.log(`\x1b[33m Booting::\x1b[36m${userToken}\x1b[0m`)
        if (userToken) {
          account = JSON.parse(await AsyncStorage.getItem("account"))
          console.log(`\x1b[33m Booting::\x1b[35m${account.login}\x1b[0m`)
          dispatch({ type: 'RESTORE_TOKEN', token: userToken, username: account.login })
        } else {
          dispatch({ type: 'FAIL_TOKEN' })
        }
      } catch (e) {
        console.log(`index.js :: Restoring token failed ${e.message}`)
        dispatch({ type: 'FAIL_TOKEN' })
      }
    }

    bootstrapAsync()
  }, []);

  // menu of actions
  const menu = useMemo(
    () => ({
      signIn: async (input) => {
        // TODO: validate login details
        const account = JSON.parse(await AsyncStorage.getItem('account'))
        console.log(`Login : ${account.login}`)
        if (input.username == account.login && bcrypt.compareSync(input.password, account.userhash)) {
          await AsyncStorage.setItem("userToken", "dummy-auth-token");
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
          dispatch({ type: 'SIGN_UP', username: input.username, userhash: hash });
          await AsyncStorage.setItem("account", JSON.stringify({ login: input.username, userhash: hash}));
        } else {
          Alert.alert(`Passwords don\'t match:\n`)
        }
      },
      changeUser: async input => {
        dispatch({ type: 'SIGN_UP', username: input.username });
        const account = JSON.parse(await AsyncStorage.getItem('account'))
        await AsyncStorage.setItem("account", JSON.stringify({ ...account, login: input.username}));
      },
      changePass: async input => {
        const account = JSON.parse(await AsyncStorage.getItem('account'))
        if (input.username == account.login && bcrypt.compareSync(input.oldpass, account.userhash)) {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(input.password, salt);
          dispatch({ type: 'SIGN_UP', username: input.username, userhash: hash });
          await AsyncStorage.setItem("account", JSON.stringify({ ...account, userhash: hash}));
        } else {
          Alert.alert('Enter current password')
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
