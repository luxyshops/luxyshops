import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Text, TouchableOpacity, View} from "react-native";
import {
  responsiveFontSize as rf,
  responsiveHeight as rh,
  responsiveWidth as rw
} from "react-native-responsive-dimensions";
import RNModal from 'react-native-modal';

class Modal extends Component {
  static defaultProps = {};
  
  static propTypes = {};
  
  state = {};
  
  render () {
    return (
      <View>
        <RNModal
          backdropColor="#27737E"
          backdropOpacity={0.9}
          useNativeDriver
          onBackdropPress={() => this.setState({deleteModalVisible: false})}
          isVisible={this.state.deleteModalVisible}
        >
          <View style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <View style={{backgroundColor: 'white', padding: rh(4), borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: rf(3), fontWeight: 'bold', textAlign: 'center', marginBottom: rh(2)}}>Are you sure?</Text>
              <Text
                style={{
                  fontSize: rf(2), fontWeight: '400',
                  textAlign: 'center', marginBottom: rh(2)
                }}
              >
                Are you sure you want to remove this item from your list?
              </Text>
              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                <TouchableOpacity activeOpacity={0.8} onPress={this.closeModal} style={{backgroundColor: '#00546B', width: rw(30), borderRadius: 30}}>
                  <Text style={{color: 'white', paddingVertical: rh(1.8),
                    textAlign: 'center', fontSize: rf(2), fontWeight: '600'}}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.removeItem} activeOpacity={0.8} style={{backgroundColor: '#005840', width: rw(30), borderRadius: 30}}>
                  <Text style={{color: 'white', paddingVertical: rh(1.8), textAlign: 'center', fontSize: rf(2), fontWeight: '600'}}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </RNModal>
      </View>
    );
  }
}

export default Modal;
