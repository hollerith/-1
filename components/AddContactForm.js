import React from 'react';
import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

export default class AddContactForm extends React.Component {

  state = {
    name: '',
    phone: '',
    isFormValid: false,
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.name !== prevState.name ||
      this.state.phone !== prevState.phone
    ) {
      this.validateForm();
    }
  }

  handleSubmit = () => {
    this.props.onSubmit([{ name: this.state.name, phone: this.state.phone }]);
  };

  getHandler = key => val => {
    this.setState({ [key]: val });
  };

  validateForm = () => {
    if (
      +this.state.phone >= 0 &&
      this.state.phone.length === 10 &&
      this.state.name.length > 0
    ) {
      this.setState({ isFormValid: true });
    } else {
      this.setState({ isFormValid: false });
    }
  };

  render() {

    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={{ padding: 20 }}>
          <TextInput
            style={styles.textinput}
            value={this.state.name}
            onChangeText={this.getHandler('name')}
            placeholder="Name"
          />
          <TextInput
            keyboardType="numeric"
            style={styles.textinput}
            value={this.state.phone}
            onChangeText={this.getHandler('phone')}
            placeholder="Phone"
          />
          <View style={{ margin: 20 }}/>
          <Button
            title="Submit"
            onPress={this.handleSubmit}
            disabled={!this.state.isFormValid}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1
  },
  banner: {
    fontSize: 36,
    fontFamily: "Lobster-Regular",
    textAlign: "center",
    color: "tomato"
  },
  textinput: {
    fontSize: 24,
    borderWidth: 1,
    borderColor: 'lightgrey',
    minWidth: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    borderRadius: 3,
  },
  text: {
    textAlign: "center"
  }
});

