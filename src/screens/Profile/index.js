import React, {Component} from 'react';
import {Text, Image, View, TouchableOpacity} from 'react-native';
import {responsiveWidth as rw, responsiveHeight as rh, responsiveFontSize as rf} from 'react-native-responsive-dimensions';
import firebase from 'react-native-firebase';
import Switch from '../../components/Switch';
import {Input} from 'react-native-elements';
import TextInput from '../../components/TextInput';
import {compose} from "redux";
import {firebaseConnect, getVal} from 'react-redux-firebase';
import {connect} from "react-redux";

import Modal from '../../components/Modal';


class Profile extends Component {
  static get options() {
    return {
      topBar: {visible: false, height: 0}
    };
  }
  
  state = {toggleValue: true, logoutModalVisible: false};
  
  logout = () => {
    this.closeModal();
    return firebase.auth().signOut();
  }
  
  onToggle = (toggleValue) => {
    this.setState({toggleValue})
  }
  
  renderSwitchBlock = () => {
    return (
      <View style={{display: 'flex', flexDirection: 'row', marginHorizontal: 20, marginVertical: rh(2), borderBottomWidth: 1, paddingBottom: 4, borderColor: '#C5CCD6'}}>
        <Text style={{flex: 1, fontSize: 17}}>Receive promotions</Text>
        <View style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
          <Switch
            value={this.state.toggleValue}
            onValueChange={this.onToggle}
            disabled={false}
            activeText='ON'
            inActiveText='OFF'
            activeTextStyle={{
              fontSize: 10,
              color: '#005840'
            }}
            inactiveTextStyle={{
              fontSize: 10,
              color: '#C4CCD7'
            }}
            containerStyle={{borderWidth: 2, borderColor: this.state.toggleValue ? '#005840' : '#C4CCD7'}}
            circleActiveColor="#005840"
            backgroundActive="white"
            backgroundInactive="white"
            circleInActiveColor="#C4CCD7"
            circleBorderWidth={0}
            renderActiveText
            renderInActiveText
            circleSize={20}
            barHeight={27}
            switchLeftPx={6}
            switchRightPx={5}
            switchWidthMultiplier={2.9}
          />
        </View>
      </View>
    )
  }
  
  closeModal = () => this.setState({logoutModalVisible: false});
  
  showModal = () => this.setState({logoutModalVisible: true});
  
  renderLogoutModal = () => (
    <Modal
      isVisible={this.state.logoutModalVisible}
      onBackdropPress={this.closeModal}
      onRightButtonPress={this.logout}
      onLeftButtonPress={this.closeModal}
      title='Log Out'
      subtitle='Are you sure you want to log out'
      leftButtonText='No'
      rightButtonText='Yes'
    />
  );
  
  render() {
    return (
      <View style={{height: '100%'}}>
        <View style={{width: '100%', display: 'flex', alignItems: 'flex-end', position: 'absolute', top: 0}}>
          <Image source={require('../../../assets/profile_picture.png')} style={{width: rw(80), height: rh(44)}}  />
        </View>
        <View>
          <View style={{marginTop: rh(40), paddingHorizontal: 20}}>
            <Text style={{fontWeight: 'bold', fontSize: 25}}>Profile</Text>
            <Text style={{fontWeight: 'bold', fontSize: 25}}>Information</Text>
          </View>
          <View style={{display: 'flex', paddingHorizontal: 10}}>
            <TextInput
              noErrorValidation
              editable={false}
              label='Name'
              input={{
                value: this.props.userName,
              }}
            />
            <TextInput
              noErrorValidation
              editable={false}
              label='Email'
              input={{
                label: 'Email',
                value: this.props.user.email,
              }}
            />
            <TextInput
              noErrorValidation
              editable={false}
              secureTextEntry
              label='Password'
              input={{
                value: 'Password123',
              }}
            />
          </View>
          {this.renderSwitchBlock()}
        </View>
        <View style={{display: 'flex', flexDirection: 'row', paddingLeft: 20}}>
          <TouchableOpacity
            onPress={this.showModal}
            style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#175641', fontSize: rf(2), marginRight: rw(3)}}>Logout</Text>
          </TouchableOpacity>
        </View>
        {this.renderLogoutModal()}
      </View>
    );
  }
}

export default compose(
  firebaseConnect([
    'users'
  ]),
  connect((state) => ({
    user: state.firebase.auth,
    userName: getVal(state.firebase, `data/users/${state.firebase.auth.uid}/name`)
  }))
)(Profile)
