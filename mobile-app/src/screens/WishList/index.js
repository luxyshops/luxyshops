import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect, getVal } from 'react-redux-firebase'
import _ from 'lodash';
import ElevatedView from 'react-native-elevated-view';
import Cross from '../../../cross.png';
import styled from 'styled-components';
import {Navigation} from "react-native-navigation";
import firebase from "react-native-firebase";
import {responsiveHeight as rh, responsiveWidth as rw} from "react-native-responsive-dimensions";

const FindInStoreButtonWrapper = styled.View`
  flex: 1;
  position: absolute;
  right: 10px;
  bottom: 10px;
  justify-content: flex-end;
  align-items: center;
`
const FindInStoreButtonTouchable = styled(TouchableOpacity)`
  background-color: #61CA93;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  width: 105px;
`

const FindInStoreButtonText = styled(Text)`
  padding-vertical: 3px;
  color: white;
  font-size: 10px;
  margin-left: 5px;
`

const StoreName = styled.Text`
 font-size: 17px;
 font-weight: 300;
 margin-bottom: 10px;
`

const StoreAddress = styled.Text`
  font-size: 10px;
  color: #C7CFD9;
`

class WishList extends Component {
  static get options() {
    return {
      topBar: {visible: false, height: 0}
    };
  }
  
  state = {};
  
  onItemRemove = (savedKey) => {
    const {user} = this.props;
    const path = `users/${user.uid}/savedItems/${savedKey}`
    return this.props.firebase.remove(path)
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
  
  async goToResults (barcode) {
    const productData = await this.queryProductFamilies(barcode);
    if (productData) {
      return Navigation.push(this.props.componentId, {
        component: {
          name: 'Results',
          passProps: {barcode, productData},
          options: {
            bottomTabs: { visible: false, drawBehind: true, animate: true }
          }
        },
      })
    }
    return alert('Oops, something went wrong')
  }
  
  renderCards = () => {
    const loadedSavedItems = this.props.savedItems
    if (!loadedSavedItems) {
      return (
        <View style={{width: '100%', display: 'flex', alignItems: 'center'}}>
          <Image source={require('../../../assets/wishlist_empty.png')} style={{width: rw(80), height: rh(55)}}  />
        </View>
      )
    }
    return _.keys(loadedSavedItems).map((itemKey) => {
      const {productFamilies} = this.props;
      const {barcode} = loadedSavedItems[itemKey];
      const res = _.keys(productFamilies).find((familyKey) => {
        return productFamilies[familyKey].find(({bar_codes}) => bar_codes.includes(barcode))
      })
      const item = productFamilies[res].find(({bar_codes}) => bar_codes.includes(barcode))
      if (!item) {
        return null;
      }
      return (
        (
          <ElevatedView
            key={itemKey}
            elevation={3}
            style={{
              position: 'relative',
              padding: 10,
              borderRadius: 5,
              display: 'flex',
              flexDirection: 'row',
              marginBottom: 20,
              backgroundColor: 'white'
            }}
          >
            <TouchableOpacity style={{height: 20, width: 20, position: 'absolute', right: 10, top: 10, zIndex: 1}}
                              activeOpacity={0.5} onPress={() => this.onItemRemove(itemKey)}>
              <Image source={Cross} style={{flex: 1, height: undefined, width: undefined}}
                     resizeMode="contain" />
            </TouchableOpacity>
            <Image
              style={{
                height: 100,
                flex: 2
              }}
              resizeMode="contain"
              source={require('../../../assets/tshirt.jpg')}
            />
            <View style={{flex: 3, display: 'flex', justifyContent: 'space-evenly'}}>
              <Text style={{fontSize: 17, fontWeight: '300'}}>{item.name}</Text>
              {item.style && (
                <Text style={{fontSize: 10, color: '#C7CFD9'}}>Style: {item.style}</Text>
              )}
              <Text style={{fontSize: 17}}>{item.price}</Text>
            </View>
            <FindInStoreButtonWrapper>
              <FindInStoreButtonTouchable
                onPress={() => this.goToResults(loadedSavedItems[itemKey].barcode)}
              >
                <Image
                  source={require(`../../../assets/find_in_stores.png`)}
                  style={{width: 10, height: 10}}
                />
                <FindInStoreButtonText>FIND IN STORE</FindInStoreButtonText>
              </FindInStoreButtonTouchable>
            </FindInStoreButtonWrapper>
          </ElevatedView>
        )
      )
    })
  }
  
  render () {
    const {userName} = this.props
    
    return (
      <ScrollView
        style={{height: '100%', paddingHorizontal: 20, paddingTop: 60}}
      >
        <View style={{marginBottom: 30}}>
          <Text style={{fontWeight: 'bold', fontSize: 23, marginBottom: 10}}>Hello, {userName}</Text>
          <Text style={{fontSize: 16, marginBottom: 5, color: '#5B5B5B'}}>You can save the items that you like to</Text>
          <Text style={{fontSize: 16, marginBottom: 5, color: '#5B5B5B'}}>return to them in the future. Just scan </Text>
          <Text style={{fontSize: 16 ,marginBottom: 5, color: '#5B5B5B'}}>the barcode and save ones you like.</Text>
        </View>
        {this.renderCards()}
      </ScrollView>
    );
  }
}

export default compose(
  firebaseConnect([
    'productFamilies',
    'users'
  ]),
  connect((state) => ({
    productFamilies: state.firebase.data.productFamilies,
    user: state.firebase.auth,
    userName: getVal(state.firebase, `data/users/${state.firebase.auth.uid}/name`),
    savedItems: getVal(state.firebase, `data/users/${state.firebase.auth.uid}/savedItems`)
  }))
)(WishList)
