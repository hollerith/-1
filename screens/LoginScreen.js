import React from "react";
import { Button, View, StyleSheet, Text } from "react-native";

export default class LoginScreen extends React.Component {

  state = {
    userName: this.props.userName,
  };

  _login = (userName) => { this.setState({ userName }) };

  render() {

    console.log(JSON.stringify(this.props))

    return (
      <View style={styles.container}>
        <Text style={styles.text}>You are currently logged out.</Text>
        <Button title="Press to Log In" onPress={this._login('test')}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1
  },
  text: {
    textAlign: "center"
  }
});
