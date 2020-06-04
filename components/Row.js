import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  row: { 
    padding: 20,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    backgroundColor: "aliceblue",
  },
  text: {
    fontSize: 18,    
  }
});

const Row = props => (
  <TouchableOpacity
    style={ styles.row }
    onPress={() => props.onSelectContact(props)}>
    <Text style={ styles.text }>{props.name}</Text>
    <Text style={ styles.text }>{props.phone}</Text>
  </TouchableOpacity>
);

Row.propTypes = {
  name: PropTypes.string,
  phone: PropTypes.string,
};

export default Row;
