import React, {Component} from 'react';
import {Animated, Dimensions, Image, Text, TouchableOpacity, View} from "react-native";
import CenterMap from "../../center-map.png";
import ElevatedView from 'react-native-elevated-view';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import customMapStyle from "../screens/Results/customMapStyle.json";
import SelectedPin from "../../pink-pin.png";
import UnselectedPin from "../../pin.png";
import AvailableColors from '../screens/Results/components/AvailableColors'
import _ from "lodash";
import Cross from "../../cross.png";
import {
  responsiveFontSize as rf,
  responsiveHeight as rh,
  responsiveWidth as rw
} from "react-native-responsive-dimensions";
import styled from "styled-components";
import HeaderCard from '../components/HeaderCard';
import {Navigation} from "react-native-navigation";
import {
  DirectionsButtonText,
  DirectionsButtonTouchable,
  DirectionsButtonWrapper
} from "../screens/Results/components/StoreCollapsible";
import getDirections from "react-native-google-maps-directions";

const { width, height } = Dimensions.get('window');


const ASPECT_RATIO = width / height;
const LATITUDE = 43.6696817;
const LONGITUDE = -79.3387563;
const LATITUDE_DELTA = 1.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(position => resolve(position), e => reject(e));
  });
};

const StoreName = styled.Text`
 font-size: 17px;
 font-weight: 300;
 margin-bottom: 10px;
`

const StoreAddress = styled.Text`
  font-size: 10px;
  color: #C7CFD9;
`

const WorkingHours = styled.Text`
  font-size: ${rf(1.5)}px;
  color: #C7CFD9;
  margin-bottom: 10px;
`

class Map extends Component {
  constructor(props) {
    super(props);
    const initialState = {markers: this.markers(), userLocation: null, headerHidden: false}
    this.translateAnimatableButtonY = new Animated.Value(rh(20));
    this.animatableButtonOpacity = new Animated.Value(0);
    this.translateAnimatableHeaderY = new Animated.Value(0);
    this.animatableHeaderOpacity = new Animated.Value(1);
    this.translateAnimatableCenterButtonY = new Animated.Value(rh(43));
    this.animatableCenterButtonOpacity = new Animated.Value(1);
    this.state = initialState;
  }
  componentDidMount () {
    getCurrentLocation().then(location => {
      if (location) {
        return this.setState({userLocation: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          }});
      }
    });
  }
  
  hideHeader = () => {
    const {headerHidden} = this.state;
  
    if (headerHidden) {
      return null;
    }
    this.props.onHeaderHide();
    return Animated.parallel([
      Animated.spring(this.translateAnimatableHeaderY, {
        toValue: -rh(50),
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(this.animatableHeaderOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(this.translateAnimatableButtonY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(this.animatableButtonOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(this.translateAnimatableCenterButtonY, {
        toValue: rh(2),
        duration: 1,
        useNativeDriver: true,
      }),
      Animated.timing(this.animatableCenterButtonOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      this.setState({ headerHidden: true })
    });
  }
  
  showHeader = () => {
    const {headerHidden} = this.state;
    if (!headerHidden) {
      return null;
    }
    this.props.onHeaderShow();
    return Animated.parallel([
      Animated.spring(this.translateAnimatableHeaderY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(this.animatableHeaderOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(this.translateAnimatableButtonY, {
        toValue: rh(20),
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(this.animatableButtonOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(this.translateAnimatableCenterButtonY, {
        toValue: rh(43),
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(this.animatableCenterButtonOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      this.setState({markers: this.markers(), headerHidden: false})
    });
  }
  
  handleCenter = () => {
    const {userLocation} = this.state;
    if (!userLocation) {
      return null;
    }
    const { latitude, longitude, latitudeDelta, longitudeDelta } = userLocation;
    this.map.animateToRegion({
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta
    })
  }
  
  renderStoreDetails = (working_hours) => {
    const selectedMarker = this.state.markers.find(({selected}) => selected);
    const sizes = _.get(selectedMarker, 'availableSizes', null);
    const colors = _.get(selectedMarker, 'availableColors', null);
    const variations = _.get(selectedMarker, 'availableVarieties', null);
    const workingHours = _.get(selectedMarker, 'workingHours', null);
    return (
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          right: 10,
          display: 'flex',
          justifyContent: 'center',
          opacity: this.animatableButtonOpacity,
          transform: [{
            translateY: this.translateAnimatableButtonY,
          }],
        }}
      >
        <ElevatedView
          style={{
            backgroundColor: 'white',
            height: 200,
            width: '100%',
            borderRadius: 5,
            padding: 20,
            display: 'flex',
            justifyContent: 'space-evenly'
          }}
        >
          <TouchableOpacity style={{height: 20, width: 20, position: 'absolute', right: 10, top: 10, zIndex: 1}}
                            activeOpacity={0.8} onPress={this.showHeader}>
            <Image source={Cross} style={{flex: 1, height: undefined, width: undefined}}
                   resizeMode="contain" />
          </TouchableOpacity>
          <StoreName>{_.get(selectedMarker, 'fullName', '')}</StoreName>
          <StoreAddress>{_.get(selectedMarker, 'address', '')}</StoreAddress>
          {sizes && (
            <Text>
              Available sizes: {sizes.map((size, index) => {
              if (index === sizes.length - 1) {
                return <Text key={index}>{size}</Text>
              }
              return <Text key={index}>{size} - </Text>
            })}
            </Text>
          )}
          {colors && (
            <AvailableColors colors={colors} />
          )}
          {variations && (
            <Text style={{marginBottom: rh(2)}}>
              Available variations: {variations.map((variation, index) => {
              if (index === variations.length - 1) {
                return <Text key={index}>{variation}</Text>
              }
              return <Text key={index}>{variation} - </Text>
            })}
            </Text>
          )}
          {workingHours && (
            <Text style={{width: '70%', lineHeight: rh(2.5)}}>Opening hours: {workingHours.map((time, index) => (
              <WorkingHours key={index}>{time}</WorkingHours>
            ))}</Text>
          )}
          <View style={{position: 'absolute', right: 20, bottom: 15}}>
            {this.renderDirectionsButton(selectedMarker)}
          </View>
        </ElevatedView>
      </Animated.View>
    )
  }
  
  handleGetDirections = ({location: {latitude, longitude}, name, address}) => {
    
    const data = {
      source: {
        latitude: this.props.userLocation.latitude,
        longitude: this.props.userLocation.longitude
      },
      destination: {
        latitude,
        longitude,
      },
    }
    
    getDirections(data)
  }
  
  renderDirectionsButton = (params) => {
    return (
      <DirectionsButtonWrapper>
        <DirectionsButtonTouchable
          onPress={() => this.handleGetDirections(params)}
        >
          <Image
            source={require('../../assets/search.png')}
            style={{width: 10, height: 10}}
          />
          <DirectionsButtonText>DIRECTIONS</DirectionsButtonText>
        </DirectionsButtonTouchable>
      </DirectionsButtonWrapper>
    )
  }
  
  markers = (onlyLocation = false) => {
    return this.props.productData.stores_in_stock.map((store) => {
      const {location, short_name, placeId, name,
        address, sizes_available, colors_available, variations_available, working_hours} = store;
      if (onlyLocation) {
        return {
          latitude: location.lat,
          longitude: location.lng,
        }
      }
      if (!sizes_available || sizes_available.some(r=> this.props.sizes_to_display.indexOf(r) >= 0)) {
        return {
          fullName: name,
          address,
          availableSizes: sizes_available,
          availableColors: colors_available,
          availableVarieties: variations_available,
          selected: false,
          name: short_name,
          placeId,
          workingHours: working_hours,
          location: {
            latitude: location.lat,
            longitude: location.lng,
          }
        }
      }
      return null;
    }).filter(store => store);
  }
  
  onMarkerPress = (marker) => {
    const newMarkers = this.state.markers.map(item => {
      if (item.placeId === marker.placeId) {
        const region = {
          ...item.location,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        };
  
        this.map.animateToRegion(region)
        const newMarkerValue = !marker.selected;
        if(newMarkerValue) {
          this.hideHeader()
        } else {
          this.showHeader()
        }
        return {...item, selected: newMarkerValue}
      }
      return {...item, selected: false}
    });
    return this.setState({markers: newMarkers})
  }
  
  renderHeaderCard = () => {
    const {productData, onItemRemove, onItemAdd} = this.props;
    const {bar_codes} = productData;
    const isSaved = _.keys(this.props.savedItems).find((itemKey) => {
      return bar_codes.includes(_.get(this.props.savedItems, `${itemKey}.barcode`));
    });
    
    return (
      <HeaderCard
        isSaved={isSaved}
        onItemRemove={onItemRemove}
        onItemAdd={onItemAdd}
        {...productData}
      />
    )
  }
  
  renderCenterButton = () => {
    return (
      <Animated.View
        style={{
          position: 'absolute',
          right: rw(3),
          zIndex: 1,
          transform: [{
            translateY: this.translateAnimatableCenterButtonY
          }],
          opacity: this.animatableCenterButtonOpacity,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            height: 50,
            width: 50,
          }}
          onPress={this.handleCenter}
        >
          <Image
            style={{flex: 1, height: undefined, width: undefined}}
            resizeMode="contain"
            source={CenterMap}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  }
  
  render () {
    return (
      <View style={{height: '100%'}}>
        {this.renderCenterButton()}
        <Animated.View
          style={{
            position: 'absolute',
            zIndex: 1,
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            transform: [{
              translateY: this.translateAnimatableHeaderY,
            }],
          }}
        >
          <ElevatedView
            style={{
              paddingHorizontal: 20,
              paddingTop: 80,
              // paddingBottom: 50,
              backgroundColor: 'white',
            }}
            elevation={5}
          >
            {this.renderHeaderCard()}
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={{marginVertical: 20, fontSize: 17}}>Available at these locations: </Text>
              {_.get(this.props, 'productData.sizes_reference', null) && (
                <TouchableOpacity
                  onPress={() => {
                    this.props.goToFilters({
                      onApply: () => this.setState({markers: this.markers()})
                    })
                  }}
                  style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
                >
                  <Image
                    source={require('../../assets/filters_icon.png')}
                    style={{width: rh(3), height: rh(3), marginRight: rw(3)}}
                  />
                  <Text style={{color: '#175641', fontSize: rf(2)}}>Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          </ElevatedView>
        </Animated.View>
        <View style={{flex: 1}}>
          <MapView
            provider={PROVIDER_GOOGLE}
            customMapStyle={customMapStyle}
            ref={ref => { this.map = ref; }}
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
            }}
            fitToElements
            showsUserLocation
            initialRegion={{
              latitude: LATITUDE,
              longitude: LONGITUDE,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
          >
            {this.state.markers.map((marker, i) => (
              <Marker
                key={i}
                onPress={() => this.onMarkerPress(marker)}
                coordinate={marker.location}
              >
                <View style={{height: 60, width: 60}}>
                  <Image
                    style={{flex: 2, height: undefined, width: undefined}}
                    resizeMode="contain"
                    source={marker.selected ? SelectedPin : UnselectedPin}
                  />
                  <View style={{flexDirection:'row'}}>
                    <Text
                      style={{fontSize: 10, color: marker.selected ? '#CCA600' : '#005840', textAlign: 'center', flex: 1, flexWrap: 'wrap'}}
                    >{marker.name}</Text>
                  </View>
                </View>
              </Marker>
            ))}
          </MapView>
          {this.renderStoreDetails()}
        </View>
      </View>
    );
  }
}

export default Map;
