import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

const Row = props => (
  <TouchableOpacity
    style={ props.checked ? styles.selected : styles.row }
    onPress={() => props.onSelectContact(props)}
    onLongPress={() => props.onCheckContact(props)}
  >
    <Text style={ styles.text }>{props.name}</Text>
    <Text style={ styles.text }>{props.phone}</Text>
  </TouchableOpacity>
);

Row.propTypes = {
  name: PropTypes.string,
  phone: PropTypes.string,
};

export default Row;

const styles = StyleSheet.create({
  row: { 
    padding: 20,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    backgroundColor: "aliceblue",
  },
  selected: { 
    padding: 20,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    backgroundColor: "lightgreen",
  },
  text: {
    fontSize: 18,    
  }
});

