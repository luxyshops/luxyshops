import React, { Component } from 'react';
import { TouchableOpacity, Text, View, Image } from 'react-native';
import {goToResults} from '../../navigation/methods';
import firebase from 'react-native-firebase';
import {Navigation} from 'react-native-navigation';
import _ from 'lodash';
import { RNCamera } from 'react-native-camera';

class Scanner extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: 'Scanner',
          fontSize: 17,
          color: 'white',
        },
        backButton: {
          color: "white",
          title: ''
        },
        drawBehind: true,
        transparent: true,
        translucent: true,
        background: { color: 'transparent' },
        elevation: 0,
        // hideOnScroll: true,
        // animate: true,
        // visible: true,
        // drawBehind: true,
        noBorder: true,
      }
    };
  }
  constructor(props) {
    super(props);
    this.camera = null;
    Navigation.events().bindComponent(this);
    
    this.state = {
      camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: RNCamera.Constants.FlashMode.auto,
        barcodeFinderVisible: true
      },
      viewRef: null,
      readingBarcode: false,
      barcode: null,
      stopScanning: false,
    };
  }
  
  componentDidAppear() {
    return this.setState({stopScanning: false, barcode: null, readingBarcode: false});
  }
  
  // componentDidMount () {
  //   firebase.database().ref('productFamilies').push({
  //     0: {
  //       name: 'Shoes',
  //       bar_codes: ['29016230001299'],
  //     }
  //   })
  // }
  
  //
  // componentDidMount () {
  //   // christmas toy = [8308182105000210, 8378051729000210]
  //   // bowl 80127206000399
  //   // t-shirt 12186973001499
  //   const barcode = '80127206000399';
  //   return this.queryProductFamilies(barcode).then((productData) => {
  //     if (productData) {
  //       return Navigation.push(this.props.componentId, {
  //         component: {
  //           name: 'Results',
  //           passProps: {barcode, productData},
  //           options: {
  //             bottomTabs: { visible: false, drawBehind: true, animate: true }
  //           }
  //         },
  //       })
  //     }
  //   })
  // }
  
  
  async queryProductFamilies (barcode) {
    const ref = firebase.database().ref('productFamilies');
    try {
      const productFamiliesSN = await ref.once('value')
      const productFamilies = productFamiliesSN.val()
      const res = _.keys(productFamilies).find((familyKey) => {
        return productFamilies[familyKey].find(({bar_codes}) => bar_codes.includes(barcode))
      })
      return productFamilies[res].find(({bar_codes}) => bar_codes.includes(barcode))
    } catch (e) {
      alert('We are sorry. We can\'t locate this item')
    }
  }
  
  
  async onBarCodeRead() {
    const {barcode} = this.state
    const productData = await this.queryProductFamilies(barcode);
    
    if (productData) {
      this.setState({stopScanning: true, readingBarcode: false, barcode: null});
      return Navigation.push(this.props.componentId, {
        component: {
          name: 'Results',
          passProps: {barcode, productData},
          options: {
            bottomTabs: { visible: false, drawBehind: true, animate: true }
          }
        }
      })
    }
    return null;
  }
  
  logout = () => {
    return firebase.auth().signOut();
  }
  
  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          barcodeFinderVisible={this.state.camera.barcodeFinderVisible}
          barcodeFinderWidth={280}
          barcodeFinderHeight={220}
          barcodeFinderBorderColor="white"
          barcodeFinderBorderWidth={2}
          defaultTouchToFocus
          flashMode={this.state.camera.flashMode}
          mirrorImage={false}
          onBarCodeRead={(scanResult) => {
            const {barcode, readingBarcode, stopScanning} = this.state;
            if (stopScanning || readingBarcode || scanResult.data === barcode) {
              return null;
            }
            this.setState({barcode: scanResult.data, readingBarcode: true}, this.onBarCodeRead);
          }}
          onFocusChanged={() => {}}
          onZoomChanged={() => {}}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
          style={styles.preview}
          type={this.state.camera.type}
        >
          <Image
            source={require('../../../assets/scanner_background.png')}
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              resizeMode: 'stretch',
            }}
          />
          <Text
            style={{
              paddingHorizontal: 40,
              fontSize: 15,
              top: 80,
              position: 'absolute',
              color: 'white',
              textAlign: 'center'
            }}
          >Look for item barcode on the price tag for inventory details.</Text>
          <Text
            style={{
              paddingHorizontal: 40,
              fontSize: 15,
              bottom: 40,
              position: 'absolute',
              color: 'white'
            }}
          >
            Fit the barcode in the frame to scan.
          </Text>
        </RNCamera>
      </View>
    );
  }
}

const styles = {
  absolute: {
    position: "absolute",
    top: 0, left: 0, bottom: 0, right: 0,
  },
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    zIndex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center'
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  enterBarcodeManualButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40
  },
  scanScreenMessage: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default Scanner;
