import React, { useContext } from 'react'
import { Button, FlatList, Text, SafeAreaView, TouchableOpacity, StyleSheet, View } from 'react-native'
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import BackgroundTimer from 'react-native-background-timer'
import AsyncStorage from '@react-native-community/async-storage'

import { LogoTitle, SplashScreen, Masthead } from "../components"
import { HeaderButtons, HeaderButton, Item, HiddenItem, OverflowMenu } from 'react-navigation-header-buttons'

import { UserContext } from "../contexts/UserProvider"
import { DataContext } from "../contexts/DataProvider"
import { ThemeContext } from "../contexts/ThemeProvider"

export default function JobsListScreen ({ navigation }) {

  const { jobs, setJobs, saveJob, deleteJob } = useContext(DataContext)
  const { theme } = useContext(ThemeContext)
  const { isSignout } = useContext(UserContext)

  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      flex: 1,
      backgroundColor: theme.backgroundColor
    },
    banner: {
      fontSize: 36,
      fontFamily: theme.bannerFontFamily,
      textAlign: "center",
      color: theme.bannerColor
    },
    menuListIcon: {
      color: theme.menuListIconColor,
    },
    menuListItemBorder: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: theme.borderColor,
    },
    text: {
      fontSize: 14,
      color: theme.textColor,
      marginBottom: 5,
    }
  });

  const onToggle = (job) => {
    job.disabled = !job.disabled
    saveJob(job)
  }

  const onDetail = (job) => {
    if (job.action == 'message') {
      navigation.navigate('Schedule', job={ job })
    } else {
      navigation.navigate('Reminder', job={ job })
    }
  }

  const onDelete = (job) => {
    deleteJob(job)
  }

  function Item({ job, index }) {

    return (
      <View 
        style={[ styles.menuListItemBorder, { margin: 10, flex: 1, flexDirection: "row", justifyContent: "center"}]}>
        <TouchableOpacity 
          style={{ flex: .3, flexDirection: "row", justifyContent: "space-between"}}
          onPress={() => onToggle(job)}>
          <Icon name={ 
            job.action == 'message' ? "email-outline" : 
            job.action == 'alert' ? "clock-outline" : "bell-outline" }
            color={ job.disabled ? theme.inactiveTintColor || "lightgrey" : theme.jobTimerIcon || "purple" }
            size={36}/>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ flex: 1, flexDirection: "row", justifyContent: "space-between"}}
          onPress={() => onDetail(job)}>
          <View>
            { job.action == 'message' ? 
              <Text style={[styles.text, { fontWeight: "bold"}]}>{job.name.toString() || job.to.toString()}</Text> : null }
            <Text style={styles.text}>{job.text}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ flex: .3, flexDirection: "row", justifyContent: "center"}}
          onPress={() => onDelete(job)}>
          <Icon name="trash-can-outline" color={ theme.voicemailIcon || "orange"} size={36}/>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={ styles.banner }>
        Alerts
      </Text> 
      <FlatList
        data={jobs}
        renderItem={({ item, index }) => <Item job={item} index={index}/>}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  )
}
