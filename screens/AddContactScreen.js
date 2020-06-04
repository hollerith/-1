import React, { useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import { UserContext } from "../contexts/UserProvider"
import AddContactForm from '../components/AddContactForm';

export default function AddContactScreen ({ route, navigation }){
  const { signOut } = useContext(UserContext);

  return <AddContactForm navigation={ navigation }  />;
}

