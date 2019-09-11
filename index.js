// index.js
import {Navigation} from 'react-native-navigation';
import {registerScreens} from './src/navigation/screens';
import { Provider } from 'react-redux'
import { createStore, combineReducers, compose } from 'redux'
import RNFirebase from 'react-native-firebase';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase'
import {store} from './src/redux'


registerScreens(store, Provider);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: 'Initializing'
      }
    },
  });
});
