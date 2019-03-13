import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Image, Text, TouchableOpacity, View} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import ElevatedView from 'react-native-elevated-view';

class HeaderCard extends Component {
  static defaultProps = {};
  
  static propTypes = {};
  
  state = {};
  
  render () {
    const { isSaved, name, style, price, onItemRemove, onItemAdd} = this.props
    return (
      <ElevatedView
        elevation={3}
        style={{
          padding: 10,
          borderRadius: 5,
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: 'white'
        }}
      >
        <Image
          style={{
            height: 100,
            flex: 2
          }}
          resizeMode="contain"
          source={require('../../assets/tshirt.jpg')}
        />
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
          <TouchableOpacity onPress={isSaved ? () => onItemRemove(isSaved) : onItemAdd}>
            <Icon
              style={{
                padding: 10,
              }}
              name={isSaved ? 'heart' : 'heart-o'}
              size={20}
              color="#61CA93"
            />
          </TouchableOpacity>
        </View>
      </ElevatedView>
    )
  }
}

export default HeaderCard;
