import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

const Row = props => (
  <TouchableOpacity
    style={ props.checked ? styles.rowselect : styles.row }
    onPress={() => props.onSelectContact(props)}
    onLongPress={() => props.onCheckContact(props)}
  >
    <Text style={ props.checked ? styles.selected : styles.text }>{props.name}</Text>
    <Text style={ props.checked ? styles.selected : styles.text }>{props.phone}</Text>
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
  rowselect: { 
    padding: 20,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    backgroundColor: "antiquewhite",
  },
  selected: {
    fontWeight: "bold",
    color: "tomato",
    backgroundColor: "antiquewhite",
    fontSize: 18,    
  },
  text: {
    fontSize: 18,    
  }
});

