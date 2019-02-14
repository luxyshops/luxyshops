import { Navigation } from 'react-native-navigation'

export const goToResults = (props) => Navigation.setRoot({
  root: {
    stack: {
      id: 'App',
      children: [
        {
          component: {
            name: 'Results',
            passProps: {...props}
          }
        }
      ],
    }
  }
})

export const goToAuth = () => Navigation.setRoot({
  root: {
    bottomTabs: {
      id: 'BottomTabsId',
      children: [
        {
          component: {
            name: 'SignIn',
            options: {
              bottomTab: {
                fontSize: 12,
                text: 'Sign In',
              }
            }
          },
        },
        {
          component: {
            name: 'SignUp',
            options: {
              bottomTab: {
                text: 'Sign Up',
                fontSize: 12,
              }
            }
          },
        },
      ],
    }
  }
});

export const goToScanner = () => Navigation.setRoot({
  root: {
    stack: {
      id: 'App',
      children: [
        {
          component: {
            name: 'Scanner',
          }
        }
      ],
    }
  }
})

export const goToWalkthrough = () => Navigation.setRoot({
  root: {
    stack: {
      id: 'App',
      children: [
        {
          component: {
            name: 'Walkthrough',
          }
        }
      ],
    }
  }
})
