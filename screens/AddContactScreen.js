import React from 'react';
import AddContactForm from '../AddContactForm';

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
    this.props.navigation.navigate('ContactList');
  };

  render() {
    console.log(JSON.stringify(props));
    return <AddContactForm onSubmit={this.handleSubmit} />;
  }
}
