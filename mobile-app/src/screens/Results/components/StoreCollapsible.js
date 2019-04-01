import React, {Component} from 'react';
import ElevatedView from 'react-native-elevated-view';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/FontAwesome';
import Collapsible from 'react-native-collapsible';
import {createOpenLink} from 'react-native-open-maps';
import getDirections from 'react-native-google-maps-directions'

import AvailableColors from './AvailableColors'

function haversineDistance(coords1, coords2, isMiles) {
  function toRad(x) {
    return x * Math.PI / 180;
  }
  
  var lon1 = coords1[0];
  var lat1 = coords1[1];
  
  var lon2 = coords2[0];
  var lat2 = coords2[1];
  
  var R = 6371; // km
  
  var x1 = lat2 - lat1;
  var dLat = toRad(x1);
  var x2 = lon2 - lon1;
  var dLon = toRad(x2)
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  
  if(isMiles) d /= 1.60934;
  
  return Math.round(d * 100) / 100;
}

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
  background-color: #175641;
  border-radius: 20px;
  width: 105px;
  margin-left: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const DirectionsButtonText = styled(Text)`
  padding-vertical: 3px;
  color: white;
  font-size: 10px;
  margin-left: 5px;
`

class StoreCollapsible extends Component {
  
  handleGetDirections = () => {
    const {location: {lat, lng}, name, address} = this.props;
  
    const data = {
      source: {
        latitude: this.props.userLocation.latitude,
        longitude: this.props.userLocation.longitude
      },
      destination: {
        latitude: lat,
        longitude: lng
      },
      params: [
        {
          key: "travelmode",
          value: "walking"        // may be "walking", "bicycling" or "transit" as well
        },
        {
          key: "dir_action",
          value: "navigate"       // this instantly initializes navigation using the given travel mode
        }
      ]
    }
    
    getDirections(data)
  }
  renderDirectionsButton = () => {
    const {location: {lat, lng}, name, address} = this.props;
    return (
      <DirectionsButtonWrapper>
        <DirectionsButtonTouchable
          onPress={this.handleGetDirections}
        >
          <Image
            source={require('../../../../assets/search.png')}
            style={{width: 10, height: 10}}
          />
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
        color="#175641"
      />
    )
  }
  
  renderWorkingHours = () => {
    const {working_hours} = this.props;
    return (
      <View style={{flex: 1}}>
        {working_hours.map((time, index) => (
          <WorkingHours key={index}>{time}</WorkingHours>
        ))}
      </View>
    );
  };
  
  renderFlavors = () => {
    const type = 'flavors';
    return this.renderOptions(type);
  }
  
  renderVariations = () => {
    const type = 'variations';
    return this.renderOptions(type);
  };
  
  renderOptions = (type) => {
    const options = this.props[`${type}_available`];
    if (options) {
      return (
        <Text style={{marginBottom: 10}}>
          Available {type}: {options.map((value, index) => {
          if (index === options.length - 1) {
            return <Text key={index}>{value}</Text>
          }
          return <Text key={index}>{value} - </Text>
        })}
        </Text>
      );
    }
    return null;
  };
  
  renderSizes = () => {
    const type = 'sizes';
    return this.renderOptions(type)
  }
  
  renderDistance = () => {
    const {userLocation, location: storeLocation} = this.props;
    if (userLocation) {
      return (
        <Text style={{fontSize: 12, color: '#C4CCD7', position: 'absolute', right: 2, top: 2}}>
          {haversineDistance([userLocation.latitude, userLocation.longitude], [storeLocation.lat, storeLocation.lng], false)} km
        </Text>
      )
    }
    return null;
  }
  
  render() {
    const {
      name, address,
      colors_available, onCollapse, collapsed, userLocation, location: storeLocation
    } = this.props;
    return (
      <ElevatedWrapper elevation={3}>
        <UnCollapsiblePartWrapper>
          {this.renderDistance()}
          <ProductDataWrapper>
              <StoreName>{name}</StoreName>
            <StoreAddress>{address}</StoreAddress>
            {this.renderSizes()}
            <AvailableColors colors={colors_available} />
            {this.renderVariations()}
            {this.renderFlavors()}
          </ProductDataWrapper>
          <ChevronWrapper>
            <TouchableOpacity onPress={() => onCollapse()}>
              {this.renderChevronIcon()}
            </TouchableOpacity>
          </ChevronWrapper>
        </UnCollapsiblePartWrapper>
        <Collapsible collapsed={collapsed} align="center">
          <CollapsibleInnerWrapper>
            {this.renderWorkingHours()}
            {this.renderDirectionsButton()}
          </CollapsibleInnerWrapper>
        </Collapsible>
      </ElevatedWrapper>
    );
  }
}

export default StoreCollapsible;
