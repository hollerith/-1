import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native"

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-community/async-storage';

import { UserContext } from "../contexts/UserProvider"
import { ThemeContext } from "../contexts/ThemeProvider"

function ThemesForm({ route, navigation }) {

  const { theme, changeTheme } = useContext(ThemeContext)
  const { user, menu } = useContext(UserContext);

  const [ state, setState ] = useState({ value: theme.name})

  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      flex: 1
    },
    banner: {
      fontSize: 36,
      fontFamily: theme.bannerFontFamily,
      textAlign: "center",
      color: theme.bannerColor
    },
    text: {
      fontSize: 22,
      color: theme.textColor,
      backgroundColor: theme.textBackgroundColor,
      borderColor: theme.borderColor,
      minWidth: 100,
      marginHorizontal: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 3,
    },
    buttonContainer: {
      padding: 10,
      borderBottomWidth: .2,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    circle: {
      height: 20,
      width: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.borderColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkedCircle: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: theme.activeTintColor,
    },
  })

  useEffect(() => {
    console.log(state.value)
    changeTheme(state.value)
  }, [state])

  return (
    <ScrollView style={{flex:1, padding: 20, backgroundColor: theme.backgroundColor}}>
      <Text style={ styles.banner }>
        Themes
      </Text>

      <View>
        {themes.map(item => {
          return (
            <TouchableOpacity key={item.name}
              style={styles.buttonContainer}
              onPress={() => {
                setState({
                  value: item.name,
                });
              }}
            >
              <Text style={ styles.text }>{item.name}</Text>
              <View style={styles.circle} >
                { state.value == item.name && <View style={styles.checkedCircle} />}
              </View>
           </TouchableOpacity>
          );
        })}
      </View> 

    </ScrollView>
  );
}

export default ThemesForm
