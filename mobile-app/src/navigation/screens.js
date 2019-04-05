import {Navigation} from 'react-native-navigation';
import Scanner from '../screens/Scanner';
import Initializing from '../screens/Initializing';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import Results from '../screens/Results';
import Filters from '../screens/Results/Filters';
import Walkthrough from '../screens/Walkthrough';
import Profile from '../screens/Profile';
import WishList from '../screens/WishList';
import ScannerIntro from '../screens/Scanner/ScannerIntro';

import CenterButton from '../components/CenterButton';

export function registerScreens(store, provider) {
  Navigation.registerComponentWithRedux('Initializing', () => Initializing, provider, store);
  Navigation.registerComponentWithRedux('SignIn', () => SignIn, provider, store);
  Navigation.registerComponentWithRedux('SignUp', () => SignUp, provider, store);
  Navigation.registerComponentWithRedux('Scanner', () => Scanner, provider, store);
  Navigation.registerComponentWithRedux('ScannerIntro', () => ScannerIntro, provider, store);
  Navigation.registerComponentWithRedux('Results', () => Results, provider, store);
  Navigation.registerComponentWithRedux('Filters', () => Filters, provider, store);
  Navigation.registerComponentWithRedux('Walkthrough', () => Walkthrough, provider, store);
  Navigation.registerComponentWithRedux('Profile', () => Profile, provider, store);
  Navigation.registerComponentWithRedux('WishList', () => WishList, provider, store);
  Navigation.registerComponent('CenterButton', () => CenterButton)
}
