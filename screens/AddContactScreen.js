import React from 'react';
import AddContactForm from '../components/AddContactForm';

addContact = newContact => {
  setState(prevState => ({
    contacts: [...prevState.contacts, newContact]
  }));
};

export default class AddContactScreen extends React.Component {

  static navigationOptions = {
    headerTitle: 'New Contact',
  };

  handleSubmit = formState => {
    addContact(formState);
    navigation.navigate('ContactList');
  };

  render() {
    return <AddContactForm onSubmit={this.handleSubmit} />;
  }
}
