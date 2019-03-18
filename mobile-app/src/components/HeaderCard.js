import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Image, Text, TouchableOpacity, View} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import ElevatedView from 'react-native-elevated-view';
import {responsiveHeight as rh} from "react-native-responsive-dimensions";

class HeaderCard extends Component {
  static defaultProps = {};
  
  static propTypes = {};
  
  state = {};
  
  renderHeaderImage = (type) => {
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
  
  render () {
    const { isSaved, name, style, price, onItemRemove, onItemAdd, type} = this.props
    return (
      <ElevatedView
        elevation={3}
        style={{
          padding: rh(2),
          borderRadius: 5,
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: 'white'
        }}
      >
        {this.renderHeaderImage(type)}
        <View style={{flex: 3, display: 'flex', justifyContent: 'space-evenly'}}>
          <Text style={{fontSize: 17, fontWeight: '300'}}>{name}</Text>
          {style && (
            <Text style={{fontSize: 10, color: '#C7CFD9'}}>Style: {style}</Text>
          )}
          <Text style={{fontSize: 17}}>{price}</Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end'
          }}
        >
          <TouchableOpacity onPress={isSaved ? () => onItemRemove(isSaved) : () => onItemAdd()}>
            <Icon
              style={{
                padding: 10,
              }}
              name={isSaved ? 'heart' : 'heart-o'}
              size={20}
              color="#005840"
            />
          </TouchableOpacity>
        </View>
      </ElevatedView>
    )
  }
}

export default HeaderCard;
