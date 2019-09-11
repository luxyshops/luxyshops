import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components';
import {responsiveHeight as rh} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/FontAwesome';
import ElevatedView from 'react-native-elevated-view';

import HeaderImage from '../../../components/HeaderImage';

const HeaderCardElevatedWrapper = styled(ElevatedView)`
  padding: ${rh(2)}px;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  background-color: white;
`;

const HeaderTextWrapper = styled.View`
  flex: 3;
  display: flex;
  justify-content: space-evenly;
`;

const ProductName = styled.Text`
  font-size: 17px;
  font-weight: 300;
`;

const ProductStyle = styled.Text`
  font-size: 10px;
  color: #C7CFD9;
`;

const ProductPrice = styled.Text`
  font-size: 17px;
`;

const HeartWrapper = styled.View`
  flex: 1;
  align-items: flex-end;
`;

class HeaderCard extends Component {
  static defaultProps = {};
  
  static propTypes = {};
  
  state = {};
  
  render () {
    const {
      productData: {price, style, name},
      type,
      iconName,
      onHeartPress,
    } = this.props;
    
    return (
      <HeaderCardElevatedWrapper elevation={3}>
        <HeaderImage type={type} />
        <HeaderTextWrapper>
          <ProductName>{name}</ProductName>
          {style && (
            <ProductStyle>Style: {style}</ProductStyle>
          )}
          <ProductPrice>{price}</ProductPrice>
        </HeaderTextWrapper>
        <HeartWrapper>
          <TouchableOpacity onPress={onHeartPress}>
            <Icon
              style={{padding: 10}}
              name={iconName}
              size={20}
              color="#005840"
            />
          </TouchableOpacity>
        </HeartWrapper>
      </HeaderCardElevatedWrapper>
    );
  }
}

export default HeaderCard;
