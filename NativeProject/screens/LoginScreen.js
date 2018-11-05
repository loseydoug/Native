import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WebBrowser, AuthSession } from 'expo';

import { MonoText } from '../components/StyledText';

const OFFICE_CLIENT_ID = "a37afbc5-0e25-4feb-b59d-745fdecd0f51";
const scope = "Calendars.Read Calendars.Read.Shared Calendars.ReadWrite Calendars.ReadWrite.Shared Contacts.Read Contacts.Read.Shared Contacts.ReadWrite User.Read offline_access User.ReadBasic.All User.ReadWrite"
const redirectUrl = "exp://expo.io/@dlosey/NativeProject";
const authUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?" +
        `client_id=${OFFICE_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
        `&scope=${encodeURIComponent(scope)}`
const component = this;
export default class HomeScreen extends React.Component {
  state = {
    isLoggedIn: false,
    result: null,
    rooms: null
  };

  _handlePressAsync = async () => {
    let result = await AuthSession.startAsync({
      authUrl:
        "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?" +
        `client_id=${OFFICE_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
        `&scope=${encodeURIComponent(scope)}` + 
        `&response_type=code`

    });
    this.setState({ result });
    console.log()
    let headers = {
      "method": "POST",
      "body": `{"AuthorizationCode": ${ JSON.stringify(result.params.code) }}`,
      "headers": {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Headers": 'x-access-token',
        "X-Access-Token": this.state.result.code,
      }
    };

    console.log("state", this.state);
    fetch("https://rooms.nexient.com/gateway/api/ms-graph-authorization/v1/AccessToken", headers)
      .then(response => {
        return response.json();
      })
      .then(myJson => {
        this.setState({rooms: myJson});
        console.log(JSON.stringify(myJson));
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Open FB Auth" onPress={this._handlePressAsync} />
        {this.state.result ? (
          <Text>{JSON.stringify(this.state.rooms)}</Text>
        ) : null}
        </View>
    );
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});