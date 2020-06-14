import React, { useContext } from 'react'
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import { ThemeContext } from "../contexts/ThemeProvider"

import PropTypes from 'prop-types';

const Row = props => {
  const { theme } = useContext(ThemeContext)

  const styles = StyleSheet.create({
    row: { 
      padding: 20,
      flexDirection: 'row', 
      justifyContent: 'space-between',
      backgroundColor: theme.rowBackgroundColor,
    },
    rowselect: { 
      padding: 20,
      flexDirection: 'row', 
      justifyContent: 'space-between',
      backgroundColor: theme.selectedBackgroundColor,
    },
    selected: {
      fontWeight: "bold",
      color: theme.selectedColor,
      backgroundColor: theme.selectedBackgroundColor,
      fontSize: 18,    
    },
    text: {
      color: theme.rowColor,
      fontSize: 18,    
    }
  });

  return (
    <TouchableOpacity
      style={ props.checked ? styles.rowselect : styles.row }
      onPress={() => props.onSelectContact(props)}
      onLongPress={() => props.onCheckContact(props)}
    >
      <Text style={ props.checked ? styles.selected : styles.text }>{props.name}</Text>
      <Text style={ props.checked ? styles.selected : styles.text }>{props.phone}</Text>
    </TouchableOpacity>
  );
}

Row.propTypes = {
  name: PropTypes.string,
  phone: PropTypes.string,
};

export default Row;

