import {Navigation} from 'react-native-navigation';
import Scanner from '../screens/Scanner'
import Initializing from '../screens/Initializing'
import SignIn from '../screens/SignIn'
import SignUp from '../screens/SignUp'
import Results from '../screens/Results'
import Walkthrough from '../screens/Walkthrough';

export function registerScreens() {
  Navigation.registerComponent('Initializing', () => Initializing);
  Navigation.registerComponent('SignIn', () => SignIn);
  Navigation.registerComponent('SignUp', () => SignUp);
  Navigation.registerComponent('Scanner', () => Scanner);
  Navigation.registerComponent('Results', () => Results);
  Navigation.registerComponent('Walkthrough', () => Walkthrough);
}
