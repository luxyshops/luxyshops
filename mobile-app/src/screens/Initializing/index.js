import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage
} from 'react-native'
import firebase from 'react-native-firebase';
import LottieView from 'lottie-react-native';

import { goToAuth, goToApp, goToWalkthrough } from '../../navigation/methods'

import { USER_KEY } from '../../config'
import SplashScreen from 'react-native-splash-screen'

export default class Initialising extends React.Component {
  componentDidMount() {
    SplashScreen.hide();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        goToApp()
      } else {
        goToWalkthrough()
        // goToAuth()
      }
    });
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
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
