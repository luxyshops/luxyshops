import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Animated, Image, TouchableOpacity} from "react-native";
import CenterMap from "../../center-map.png";

class CenterButton extends Component {
  static defaultProps = {};
  
  static propTypes = {};
  
  state = {};
  
  render () {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={{
          height: 50,
          width: 50,
        }}
      >
        <Image
          style={{flex: 1, height: undefined, width: undefined}}
          resizeMode="contain"
          source={CenterMap}
        />
      </TouchableOpacity>
    );
  }
}

export default CenterButton;
