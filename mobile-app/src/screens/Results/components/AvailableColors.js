import React, {Component} from 'react';
import {Text, View} from 'react-native';
import styled from 'styled-components';

export const pickRightBorderColor = (bgColor, lightColor, darkColor) => {
  const color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16); // hexToR
  const g = parseInt(color.substring(2, 4), 16); // hexToG
  const b = parseInt(color.substring(4, 6), 16); // hexToB
  const uicolors = [r / 255, g / 255, b / 255];
  const c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  const L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
  return (L > 0.179) ? darkColor : lightColor;
}

const StyledWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  margin-vertical: 10px;
`

const ColorCircle = styled.View`
  margin-left: 5px;
  height: 20px;
  width: 20px;
  border-width: 1px;
  border-color: ${({color}) => pickRightBorderColor(color, '#C8C7CC', 'transparent')};
  border-radius: 100px;
  background-color: ${({color}) => color};
`

export default class AvailableColors extends Component {
  render() {
    const {colors} = this.props;
    if (!colors) {
      return null;
    }
    return (
      <StyledWrapper>
        <Text>Colors:</Text>
        {this.props.colors.map(color => (
          <ColorCircle key={color} color={color}/>
        ))}
      </StyledWrapper>
    )
  }
}
