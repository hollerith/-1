import React, { useContext } from 'react';
import { SectionList, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { ThemeContext } from "../contexts/ThemeProvider"

import Row from './Row';

const SectionListContacts = props => {

  const { theme } = useContext(ThemeContext)

  const styles = StyleSheet.create({
    title: {
      flex: 1,
      textAlign: "center",
      fontSize: 32,
      fontWeight: "bold",
      color: theme.activeTintColor,
      backgroundColor: theme.sectionBackgroundColor,
    },
  });

  const renderSectionHeader = ({ section }) => <Text style={ styles.title }>{section.title}</Text>;

  const contactsByLetter = props.contacts.sort((a, b) => { return a.name > b.name ? 1 : -1 }).reduce((obj, contact) => {
    const firstLetter = contact.name[0].toUpperCase();
    return {
      ...obj,
      [firstLetter]: [...(obj[firstLetter] || []), contact],
    };
  }, {});

  const sections = Object.keys(contactsByLetter)
    .sort()
    .map(letter => ({
      data: contactsByLetter[letter],
      title: letter,
    }));

  return (
    <SectionList
      keyExtractor={item => item.phone}
      sections={sections}
      renderItem={({ item }) => <Row {...item} 
        onCheckContact={props.onCheckContact} 
        onSelectContact={props.onSelectContact} 
      /> }
      renderSectionHeader={renderSectionHeader}
    />
  );
};

SectionListContacts.propTypes = {
  contacts: PropTypes.array,
};

export default SectionListContacts;
