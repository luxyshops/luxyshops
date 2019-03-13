import React, {Component} from 'react';
import {Text, Image, View, TouchableOpacity} from 'react-native';
import {responsiveWidth as rw, responsiveHeight as rh, responsiveFontSize as rf} from "react-native-responsive-dimensions";
import firebase from 'react-native-firebase';
import {Navigation} from 'react-native-navigation';


class Profile extends Component {
  static get options() {
    return {
      topBar: {visible: false, height: 0}
    };
  }
  
  state = {};
  
  logout = () => {
    return firebase.auth().signOut();
  }
  
  render() {
    return (
      <View style={{height: '100%'}}>
        <View style={{width: '100%', display: 'flex', alignItems: 'flex-end', position: 'absolute', top: 0}}>
          <Image source={require('../../../assets/profile_picture.png')} style={{width: rw(80), height: rh(44)}}  />
        </View>
        <View style={{paddingHorizontal: 20, marginTop: rh(40)}}>
          <Text style={{fontWeight: 'bold', fontSize: 25}}>Profile</Text>
          <Text style={{fontWeight: 'bold', fontSize: 25}}>Information</Text>
        </View>
        <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Image
            resizeMode="contain"
            source={require('../../../assets/profile-forms.png')}
            style={{height: rh(32), width: rw(92)}}
          />
        </View>
        <View style={{display: 'flex', flexDirection: 'row', paddingLeft: 20}}>
          <TouchableOpacity
            onPress={this.logout}
            style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#175641', fontSize: rf(2), marginRight: rw(3)}}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Profile;
