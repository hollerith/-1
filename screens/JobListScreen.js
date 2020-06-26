import React, { useContext } from 'react';
import { Button, FlatList, Text, SafeAreaView, TouchableOpacity, StyleSheet, View } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import BackgroundTimer from 'react-native-background-timer';
import AsyncStorage from '@react-native-community/async-storage';
import { DataContext } from "../contexts/DataProvider"
import { ThemeContext } from "../contexts/ThemeProvider"

export default function JobListScreen ({ navigation }) {
  const { jobs, setJobs, saveJob } = useContext(DataContext);
  const { theme } = useContext(ThemeContext)

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
    text: {
      fontSize: 14,
      color: theme.textColor,
      margin: 10,
      textAlign: "center"
    }
  });

  const onToggle = (job) => {
    job.disabled = !job.disabled
    saveJob(job)
  }

  const onDetail = (job) => {
    navigation.navigate('SendMessage', job)
  }

  const onDelete = (index) => {
    jobs.splice(index, 1)
    setJobs(JSON.stringify(jobs))
  }

  function Item({ job, index }) {
    return (
      <View 
        style={{ margin: 10, flex: 1, flexDirection: "row", justifyContent: "center"}}>
        <TouchableOpacity 
          style={{ flex: .3, flexDirection: "row", justifyContent: "space-between"}}
          onPress={() => onToggle(job)}>
          <Icon name="clock-outline" 
            color={ job.disabled ? "lightgrey" : "purple" }
            size={36}/>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ flex: 1, flexDirection: "row", justifyContent: "space-between"}}
          onPress={() => onDetail(job)}>
          <Text style={styles.text}>{job.to.toString()}</Text>
          <Text style={styles.text}>{job.text}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ flex: .3, flexDirection: "row", justifyContent: "center"}}
          onPress={() => onDelete(index)}>
          <Icon name="trash-can-outline" color="orange" size={36}/>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={jobs}
        renderItem={({ item, index }) => <Item job={item} index={index}/>}
        keyExtractor={item => item.id}
      />
      <Button title='Stop Jobs' onPress={() => BackgroundTimer.stopBackgroundTimer() } />
    </SafeAreaView>
  )
}
