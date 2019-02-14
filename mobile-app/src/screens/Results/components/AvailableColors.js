import React, {Component} from 'react';
import {Text, View} from 'react-native';
import styled from 'styled-components';

const StyledWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  margin-bottom: 10px;
`

const ColorCircle = styled.View`
  margin-left: 5px;
  height: 20px;
  width: 20px;
  border-width: 0.5px;
  border-radius: 100px;
  background-color: ${({color}) => color};
`

export default class AvailableColors extends Component {
  render() {
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
