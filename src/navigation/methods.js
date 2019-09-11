import { Navigation } from 'react-native-navigation'

export const goToResults = (props) => Navigation.setRoot({
  root: {
    stack: {
      id: 'Results',
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

export const goToSignIn = () => Navigation.setRoot({
  root: {
    stack: {
      id: 'App',
      children: [
        {
          component: {
            name: 'SignIn',
          }
        }
      ],
    }
  }
});

export const goToSignUp = () => Navigation.setRoot({
  root: {
    stack: {
      id: 'App',
      children: [
        {
          component: {
            name: 'SignUp',
          }
        }
      ],
    }
  }
});

export const goToApp = () => Navigation.setRoot({
  root: {
    bottomTabs: {
      children: [
        // {
        //   stack: {
        //     children: [
        //       {
        //         component: {
        //           name: 'Filters',
        //         }
        //       }
        //     ],
        //     options: {
        //       bottomTab: {
        //         fontSize: 10,
        //         text: "filters_demo",
        //         icon: require('../../assets/bottom-heart.png'),
        //         selectedIcon: require('../../assets/bottom-heart-selected.png'),
        //         textColor: '#C4CCD7',
        //         selectedTextColor: '#61CA93'
        //       }
        //     }
        //   }
        // },
        {
          stack: {
            children: [
              {
                component: {
                  name: 'WishList',
                }
              }
            ],
            options: {
              bottomTab: {
                fontSize: 10,
                text: "WISHLIST",
                icon: require('../../assets/bottom-heart.png'),
                selectedIcon: require('../../assets/bottom-heart-selected.png'),
                textColor: '#C4CCD7',
                selectedTextColor: '#005840'
              }
            }
          }
        },
        {
          stack: {
            children: [
              {
                component: {
                  name: 'ScannerIntro',
                }
              }
            ],
            options: {
              bottomTab: {
                fontSize: 10,
                text: "SCANNER",
                icon: require('../../assets/bottom-scanner.png'),
                selectedIcon: require('../../assets/bottom-scanner-selected.png'),
                textColor: '#C4CCD7',
                selectedTextColor: '#005840'
              }
            }
          },
        },
        {
          stack: {
            children: [
              {
                component: {
                  name: 'Profile',
                }
              }
            ],
            options: {
              bottomTab: {
                fontSize: 10,
                text: "PROFILE",
                icon: require('../../assets/bottom-profile-unselected.png'),
                selectedIcon: require('../../assets/bottom-profile.png'),
                textColor: '#C4CCD7',
                selectedTextColor: '#005840'
              }
            }
          }
        },
      ],
      options: {
        bottomTabs: {
          currentTabIndex: 1
        }
      }
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
      id: 'Walkthrough',
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
