import React, {Component} from 'react';
import {Text, Image, View} from 'react-native';
import ResponsiveImage from 'react-native-responsive-image';
import {responsiveWidth as rw, responsiveHeight as rh} from "react-native-responsive-dimensions";
import {StyledButton} from "../SignIn";
import {Navigation} from 'react-native-navigation';


class ScannerIntro extends Component {
  static get options() {
    return {
      topBar: {visible: false, height: 0}
    };
  }
  
  state = {};
  
  goToScanner = () => {
    return Navigation.push(this.props.componentId, {
      component: {
        name: 'Scanner',
        options: {
          bottomTabs: { visible: false, drawBehind: true, animate: true }
        }
      }
    })
  }
  
  render() {
    return (
      <View style={{height: '100%', paddingTop: 60}}>
        <View style={{marginBottom: 30, paddingHorizontal: 20}}>
          <Text style={{fontWeight: 'bold', fontSize: 23, marginBottom: 10}}>Let's scan</Text>
          <Text style={{fontSize: 16, color: '#5B5B5B'}}>Press Scan button to simply scan the</Text>
          <Text style={{fontSize: 16, color: '#5B5B5B'}}>barcode of the item you like to see</Text>
          <Text style={{fontSize: 16, color: '#5B5B5B'}}>what's available around.</Text>
        </View>
        <View style={{width: '100%', display: 'flex', alignItems: 'center'}}>
          <Image
            source={require(`../../../assets/scanner-wallpaper.png`)}
            style={{width: rw(84), height: rh(47)}}
          />
        </View>
        <View style={{paddingHorizontal: 20, marginTop: rh(5)}}>
          <StyledButton onPress={this.goToScanner}>
            <Text style={{color: 'white', paddingVertical: 15, textAlign: 'center'}}>
              Start Scanning
            </Text>
          </StyledButton>
        </View>
      </View>
    );
  }
}

export default ScannerIntro;
