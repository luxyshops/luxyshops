import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect, getVal } from 'react-redux-firebase'
import {StyledButton} from "../SignIn";
import {responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf} from "react-native-responsive-dimensions";

class Filters extends Component {
  static get options() {
    return {
      topBar: {
        backButton: { // android
          color: "black",
          title: ''
        },
        drawBehind: true,
        transparent: true,
        translucent: true,
        elevation: 0,
        title: {
          text: 'Filters',
          fontSize: 17,
        },
        hideOnScroll: true,
        // animate: true,
        // visible: true,
        // drawBehind: true,
        noBorder: true,
        background: {
          color: 'transparent',
        }
      }
    };
  }
  
  constructor(props) {
    super(props);
    const {sizes_reference, sizes_to_display} = props;
    const options = sizes_reference.map((size) => {
      return ({
        title: size,
        checked: Boolean(sizes_to_display.find(sizeName => sizeName === size)),
      })
    });
    
    this.state = {
      options,
    }
  }
  
  onItemRemove = (savedKey) => {
    const {user} = this.props;
    const path = `users/${user.uid}/savedItems/${savedKey}`
    return this.props.firebase.remove(path)
  }
  
  renderCheckMarks = () => {
    return (
      <View style={{marginBottom: rh(7)}}>
        {this.state.options.map((option) => (
          <TouchableOpacity
            onPress={() => {
              const newOptions = this.state.options.map(oldOption => {
                if (oldOption.title === option.title) {
                  return {...oldOption, checked: !oldOption.checked}
                }
                return {...oldOption}
              })
              return this.setState({options: newOptions})
            }}
            key={option.title}
            style={{paddingVertical: rh(2), borderBottomWidth: 1, borderColor: '#EBEDF1', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Text style={{fontSize: rf(2.2), fontWeight: '500', color: option.checked ? 'black' : '#C4CCD7'}}>{option.title}</Text>
            {option.checked ? (
              <Image
                source={require('../../../assets/filter-checkmark-active.png')}
                style={{width: rh(3), height: rh(3)}}
              />
            ): (
              <Image
                source={require('../../../assets/filter-checkmark.png')}
                style={{width: rh(3), height: rh(3)}}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  }
  
  render () {
    return (
      <ScrollView
        style={{height: '100%', paddingVertical: 60, paddingHorizontal: 20}}
        showsVerticalScrollIndicator={false}
      >
        <View style={{marginBottom: 40}}>
          <Text style={{fontWeight: 'bold', fontSize: 23, marginBottom: 10}}>What size are you</Text>
          <Text style={{fontWeight: 'bold', fontSize: 23, marginBottom: 10}}>looking for?</Text>
        </View>
        {this.renderCheckMarks()}
        <View style={{marginBottom: rh(15)}}>
          <StyledButton onPress={() => this.props.onApply(this.state.options.filter(({checked}) => checked).map(({title}) => title))}>
            <Text style={{color: 'white', paddingVertical: 15, textAlign: 'center'}}>
              Apply
            </Text>
          </StyledButton>
        </View>
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
)(Filters)
