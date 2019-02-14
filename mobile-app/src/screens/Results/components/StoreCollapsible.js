import React, {Component} from 'react';
import ElevatedView from 'react-native-elevated-view';
import {Text, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/FontAwesome';
import Collapsible from 'react-native-collapsible';
import openMap from 'react-native-open-maps';

import AvailableColors from './AvailableColors'

const ElevatedWrapper = styled(ElevatedView)`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: white;
  display: flex;
`

const UnCollapsiblePartWrapper = styled.View`
  display: flex;
  flex-direction: row;
`

const ProductDataWrapper = styled.View`
  display: flex;
  flex: 5;
  justify-content: space-evenly;
`

const StoreName = styled.Text`
 font-size: 17px;
 font-weight: 300;
 margin-bottom: 10px;
`

const StoreAddress = styled.Text`
  font-size: 10px;
  color: #C7CFD9;
`

const ChevronWrapper = styled.View`
  flex: 3;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`

const CollapsibleInnerWrapper = styled.View`
  display: flex;
  flex-direction: row;
`

const WorkingHours = styled.Text`
  font-size: 11px;
  color: #C7CFD9;
  margin-bottom: 10px;
`

const DirectionsButtonWrapper = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`
const DirectionsButtonTouchable = styled(TouchableOpacity)`
  background-color: #61CA93;
  align-items: center;
  border-radius: 20px;
  width: 105px;
  margin-left: 20px;
`

const DirectionsButtonText = styled(Text)`
  padding-vertical: 2px;
  color: white;
  font-size: 11px
`

class StoreCollapsible extends Component {
  renderDirectionsButton = () => {
    return (
      <DirectionsButtonWrapper>
        <DirectionsButtonTouchable onPress={() => openMap({latitude: 37.865101, longitude: -119.538330, provider: 'google'})}>
          <DirectionsButtonText>DIRECTIONS</DirectionsButtonText>
        </DirectionsButtonTouchable>
      </DirectionsButtonWrapper>
    )
  }
  
  renderChevronIcon = () => {
    const {collapsed} = this.props
    return (
      <Icon
        name={collapsed ? 'chevron-down' : 'chevron-up'}
        style={{padding: 10}}
        size={20}
        color="#61CA93"
      />
    )
  }
  
  render() {
    const {name, address, sizes_available, colors_available, onCollapse, collapsed, working_hours} = this.props
    return (
      <ElevatedWrapper elevation={3}>
        <UnCollapsiblePartWrapper>
          <ProductDataWrapper>
            <StoreName>{name}</StoreName>
            <StoreAddress>{address}</StoreAddress>
            <Text style={{marginBottom: 10}}>
              Available sizes: {sizes_available.map((size, index) => (index === sizes_available.length - 1) ? `${size}` : `${size} - `)}
            </Text>
            <AvailableColors colors={colors_available} />
          </ProductDataWrapper>
          <ChevronWrapper>
            <TouchableOpacity onPress={() => onCollapse()}>
              {this.renderChevronIcon()}
            </TouchableOpacity>
          </ChevronWrapper>
        </UnCollapsiblePartWrapper>
    
        <Collapsible collapsed={collapsed} align="center">
          <CollapsibleInnerWrapper>
            <View style={{flex: 1}}>
              {working_hours.map(time => (
                <WorkingHours>{time}</WorkingHours>
              ))}
            </View>
            {this.renderDirectionsButton()}
          </CollapsibleInnerWrapper>
        </Collapsible>
      </ElevatedWrapper>
    );
  }
}

export default StoreCollapsible;
