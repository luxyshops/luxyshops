import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage
} from 'react-native'
import firebase from 'react-native-firebase';

import { goToAuth, goToScanner, goToWalkthrough } from '../../navigation/methods'

import { USER_KEY } from '../../config'
import SplashScreen from 'react-native-splash-screen'

export default class Initialising extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      console.log('user: ', user)
      if (user) {
        goToScanner()
      } else {
        // goToWalkthrough()
        goToAuth()
      }
      return SplashScreen.hide();
    });
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Loading</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 28
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
