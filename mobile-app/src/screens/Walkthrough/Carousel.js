import React, {Component} from 'react';
import {Keyboard, View, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {responsiveHeight as rh, responsiveWidth as rw} from 'react-native-responsive-dimensions';
import { goToSignIn, goToSignUp } from '../../navigation/methods'

import {itemWidth, sliderWidth} from './SliderEntry';
import {StyledButton} from '../SignIn';
import {Navigation} from "react-native-navigation";


class CarouselSlide extends Component {
  static propTypes = {
    getRef: PropTypes.func,
  };
  
  static defaultProps = {
    getRef: () => null,
  };
  
  get pagination () {
    const { numOfDots, activeSlide } = this.props;
    return (
      <Pagination
        dotsLength={numOfDots}
        activeDotIndex={activeSlide}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1.0,
          shadowRadius: 5,
          shadowColor: '#61CA93',
          marginHorizontal: 8,
          backgroundColor: '#61CA93'
        }}
        inactiveDotStyle={{
          shadowOpacity: 0,
          backgroundColor: '#C8C7CC',
          // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }
  
  renderText = () => {
    const {activeSlide} = this.props;
    if (activeSlide === 0) {
      return (
        <View style={{marginTop: 20}}>
          <Text style={{textAlign: 'center', marginBottom: 5, fontSize: 15, color: '#5B5B5B'}}>Can’t find the right size in the store?</Text>
          <Text style={{textAlign: 'center', marginBottom: 5, fontSize: 15, color: '#5B5B5B'}}>Looking for a similar item?</Text>
          <Text style={{textAlign: 'center', fontSize: 15, color: '#5B5B5B', fontWeight: 'bold'}}>Luxy to the rescue!</Text>
        </View>
      );
    }
    return (
      <View style={{marginTop: 20}}>
        <Text style={{textAlign: 'center', marginBottom: 5, fontSize: 15, color: '#5B5B5B'}}>You can scan the barcode to see what </Text>
        <Text style={{textAlign: 'center', marginBottom: 5, fontSize: 15, color: '#5B5B5B'}}>other stores have in stock. We bring a</Text>
        <Text style={{textAlign: 'center', fontSize: 15, color: '#5B5B5B'}}>next level shopping experience.</Text>
      </View>
    );
  }
  
  renderButton = () => {
    const {activeSlide, onButtonPress} = this.props;
    return (
      <View style={{paddingHorizontal: rw(10), marginVertical: 15}}>
        <StyledButton
          onPress={activeSlide === 0 ? () => onButtonPress() : () => this.toSignUp()}
          activeOpacity={0.8}
        >
          <Text style={{color: 'white', paddingVertical: rh(2), textAlign: 'center', fontSize: 15, fontWeight: 'bold'}}>
            {activeSlide === 0 ? 'Next' : 'Sign me up'}
          </Text>
        </StyledButton>
      </View>
    );
  }
  
  toSignIn = () => {
    return goToSignIn()
  }
  
  toSignUp = () => {
    return goToSignUp();
  }
  
  render() {
    const {getRef, ...props} = this.props;
    return (
      <View>
        <Carousel
          bounces={false}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          inactiveSlideShift={0}
          onScroll={Keyboard.dismiss}
          activeAnimationType="spring"
          containerCustomStyle={{marginTop: 20}}
          activeAnimationOptions={{
            friction: 4,
            tension: 40,
          }}
          ref={carRef => getRef(carRef)}
          {...props}
        />
        {this.pagination}
        {this.renderText()}
        {this.renderButton()}
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
          <Text style={{textAlign: 'center', marginBottom: 5, fontSize: 15, color: '#5B5B5B', marginRight: 5}}>Already have an account?</Text>
          <TouchableOpacity onPress={this.toSignIn}>
            <Text style={{textAlign: 'center', marginBottom: 5, fontSize: 15, color: '#5B5B5B', fontWeight: 'bold'}}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default CarouselSlide;
