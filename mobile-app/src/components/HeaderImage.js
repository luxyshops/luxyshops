import React, {Component} from 'react';
import {Image} from 'react-native';
import PropTypes from 'prop-types';
import {responsiveHeight as rh} from 'react-native-responsive-dimensions';

class HeaderImage extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
  };
  
  render () {
    const {type} = this.props;
    const imageStyles = {
      marginRight: rh(2),
      height: 100,
      flex: 2
    }
    switch (type) {
      case 'shoes':
        return (
          <Image
            style={imageStyles}
            resizeMode="contain"
            source={require('../../assets/shoe_icon.png')}
          />
        )
      case 'kitchen':
      case 'food':
        return (
          <Image
            style={imageStyles}
            resizeMode="contain"
            source={require('../../assets/food_icon.png')}
          />
        )
      case 'toy':
        return (
          <Image
            style={imageStyles}
            resizeMode="contain"
            source={require('../../assets/toy_icon.png')}
          />
        )
      case 'interior':
        return (
          <Image
            style={imageStyles}
            resizeMode="contain"
            source={require('../../assets/interiour_icon.png')}
          />
        )
      default:
        return (
          <Image
            style={imageStyles}
            resizeMode="contain"
            source={require('../../assets/clothing_icon.png')}
          />
        )
    }
  }
}

export default HeaderImage;
