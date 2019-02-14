import React, {Component} from 'react';
import {Keyboard, View} from 'react-native';
import PropTypes from 'prop-types';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {responsiveHeight as rh} from 'react-native-responsive-dimensions';

import {itemWidth, sliderWidth} from './SliderEntry';


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
        containerStyle={{borderWidth: 1}}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: 'black'
        }}
        inactiveDotStyle={{
          // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }
  
  render() {
    const {getRef, ...props} = this.props;
    return (
      <View>
        <Carousel
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          inactiveSlideScale={0.84}
          inactiveSlideOpacity={0.4}
          inactiveSlideShift={rh(1)}
          onScroll={Keyboard.dismiss}
          activeAnimationType="spring"
          containerCustomStyle={{borderWidth: 1, borderColor: 'blue'}}
          activeAnimationOptions={{
            friction: 4,
            tension: 40,
          }}
          ref={carRef => getRef(carRef)}
          {...props}
        />
        {this.pagination}
      </View>
    );
  }
}

export default CarouselSlide;
