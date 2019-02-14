import React, { Component } from 'react';
import { TouchableOpacity, Text, View, Image } from 'react-native';
import {goToResults} from '../../navigation/methods';
import firebase from 'react-native-firebase';
import {Navigation} from 'react-native-navigation'
import _ from 'lodash'
import { RNCamera } from 'react-native-camera';
import BG from '../../../bg.png'

class Scanner extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: 'Scanner',
          fontSize: 17,
          color: 'white'
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
  
  componentDidMount () {
    return this.queryProductFamilies('12186973001499');
  }
  
  
  async queryProductFamilies (barcode) {
    const ref = firebase.database().ref('productFamilies');
    const productFamiliesSN = await ref.once('value')
    const productFamilies = productFamiliesSN.val()
    const res = _.keys(productFamilies).find((familyKey) => {
      return productFamilies[familyKey].find(({bar_codes}) => bar_codes.includes(barcode))
    })
    return productFamilies[res].find(({bar_codes}) => bar_codes.includes(barcode))
  }
  
  
  async onBarCodeRead() {
    const {barcode} = this.state
    console.log('barcode', barcode)
    const productData = await this.queryProductFamilies(barcode);
    
    if (productData) {
      this.setState({stopScanning: true, readingBarcode: false, barcode: null});
      return Navigation.push(this.props.componentId, {
        component: {
          name: 'Results',
          passProps: {barcode, productData}
        }
      })
    }
    return null;
  }
  
  logout = () => {
    return firebase.auth().signOut();
  }
  
  render() {
    console.log(this.props, 'fsdfsd')
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
            source={BG}
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
              color: 'white'
            }}
          >Scan the barcode or data matrix on the price tag to find out more about the item.</Text>
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
          <TouchableOpacity style={{position: 'absolute', right: 5}} onPress={this.logout}><Text style={{color: 'white'}}>Logout</Text></TouchableOpacity>
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
