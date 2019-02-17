import React, {Fragment} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Animated,
} from 'react-native'
import StoreCollapsible from './components/StoreCollapsible'
import Icon from 'react-native-vector-icons/FontAwesome';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import _ from 'lodash';
import ElevatedView from 'react-native-elevated-view';
import customMapStyle from './customMapStyle';
import {Navigation} from 'react-native-navigation';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

import AvailableColors from './components/AvailableColors';

import UnselectedPin from '../../../pin.png';
import SelectedPin from '../../../pink-pin.png';
import CenterMap from '../../../center-map.png';
import Cross from '../../../cross.png';
import styled from 'styled-components';

const { width, height } = Dimensions.get('window');

const WorkingHours = styled.Text`
  font-size: 11px;
  color: #C7CFD9;
  margin-bottom: 10px;
`

const listNavOptions = {
  topBar: {
    rightButtons: [
      {
        id: 'listButton',
        text: 'List'
      }
    ],
    title: {
      text: 'Map',
    },
    drawBehind: false,
    transparent: false,
    translucent: false,
    hideOnScroll: false,
  }
}

const mapNavOptions = {
  topBar: {
    rightButtons: [
      {
        id: 'mapButton',
        text: 'Map'
      }
    ],
    title: {
      text: 'Search results',
    },
    drawBehind: true,
    transparent: true,
    translucent: true,
    hideOnScroll: true,
  }
}

const ASPECT_RATIO = width / height;
const LATITUDE = 43.6532;
const LONGITUDE = -79.3832;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const DEFAULT_PADDING = { top: 60, right: 60, bottom: 60, left: 60 };

const StoreName = styled.Text`
 font-size: 17px;
 font-weight: 300;
 margin-bottom: 10px;
`

const StoreAddress = styled.Text`
  font-size: 10px;
  color: #C7CFD9;
`


export default class Results extends React.Component {
  static get options() {
    return {
      topBar: {
        backButton: { // android
          color: "rgba(60, 109, 240, 0.87)",
        },
        rightButtons: [
          {
            id: 'mapButton',
            text: 'Map'
          }
        ],
        drawBehind: true,
        transparent: true,
        translucent: true,
        elevation: 0,
        title: {
          text: 'Search results',
          fontSize: 17,
        },
        hideOnScroll: true,
        // animate: true,
        // visible: true,
        // drawBehind: true,
        noBorder: true,
        background: {
          color: 'transparent',
        }
      }
    };
  }
  
  constructor(props) {
    super(props);
    const initialState = {rightNavBarButton: 'mapButton', showList: true, markers: this.markers()}
    props.productData.stores_in_stock.forEach((store, idx) => initialState[`collapse${idx}`] = true);
    Navigation.events().bindComponent(this);
    this.translateAnimatableButtonY = new Animated.Value(100);
    this.animatableButtonOpacity = new Animated.Value(0);
    this.translateAnimatableHeaderY = new Animated.Value(0);
    this.animatableHeaderOpacity = new Animated.Value(1);
    this.state = initialState
  }
  
  hideHeader = () => {
    return Animated.parallel([
      Animated.spring(this.translateAnimatableHeaderY, {
        toValue: -300,
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
    ]).start(() => this.setState({ topButtonAnimationIsDone: true }));
  }
  
  showHeader = () => {
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
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(this.animatableButtonOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => this.setState({ markers: this.markers() }));
  }
  
  markers = (onlyLocation = false) => {
    return this.props.productData.stores_in_stock.map((store) => {
      console.log('store', store)
      const {location, short_name, placeId, name,
        address, sizes_available, colors_available, variations_available, working_hours} = store;
      if (onlyLocation) {
        return {
          latitude: location.lat,
          longitude: location.lng,
        }
      }
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
    });
  }
  
  fitAllMarkers() {
    this.map.fitToCoordinates(this.markers(true), {
      edgePadding: DEFAULT_PADDING,
      animated: true,
    });
  }
  
  navigationButtonPressed({ buttonId }) {
    const {rightNavBarButton} = this.state;
    if (buttonId === 'mapButton') {
      Navigation.mergeOptions(this.props.componentId, listNavOptions);
      return this.setState({showList: false});
    }
    if (buttonId === 'listButton') {
      Navigation.mergeOptions(this.props.componentId, mapNavOptions);
      return this.setState({showList: true});
    }
    return null;
  }
  
  renderHeaderCard = () => (
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
        source={require('../../../assets/tshirt.jpg')}
      />
      <View style={{flex: 3, display: 'flex', justifyContent: 'space-evenly'}}>
        <Text style={{fontSize: 17, fontWeight: '300'}}>{this.props.productData.name}</Text>
        {this.props.productData.style && (
          <Text style={{fontSize: 10, color: '#C7CFD9'}}>Style: {this.props.productData.style}</Text>
        )}
        <Text style={{fontSize: 17}}>{this.props.productData.price}</Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'flex-end'
        }}
      >
        <TouchableOpacity>
          <Icon
            style={{
              padding: 10,
            }}
            name="heart-o"
            size={20}
            color="#61CA93"
          />
        </TouchableOpacity>
      </View>
    </ElevatedView>
  )
  
  renderStores = () => {
    const {productData} = this.props
    return (
      <View style={{marginBottom: 20}}>
        {productData.stores_in_stock.map((store, idx) => (
          <StoreCollapsible
            collapsed={this.state[`collapse${idx}`]}
            onCollapse={() => this.setState({[`collapse${idx}`]: !this.state[`collapse${idx}`]})}
            {...store}
            key={idx}
          />
        ))}
      </View>
    )
  }
  
  renderList = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          backgroundColor: '#FCFCFC',
        }}
      >
        <View
          style={{padding: 20}}
        >
          {this.renderHeaderCard()}
          <Text style={{marginVertical: 20, fontSize: 17}}>Available at these locations: </Text>
          {this.renderStores()}
        </View>
      </ScrollView>
    );
  };
  
  onMarkerPress = (marker) => {
    const newMarkers = this.state.markers.map(item => {
      if (item.placeId === marker.placeId) {
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
  
  renderStoreDetails = (working_hours) => {
    const selectedMarker = this.state.markers.find(({selected}) => selected);
    console.log('selectedMarker', selectedMarker)
    const sizes = _.get(selectedMarker, 'availableSizes', null);
    const colors = _.get(selectedMarker, 'availableColors', null);
    const variations = _.get(selectedMarker, 'availableVariations', null);
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
            <Text>
              Available variations: {variations.map((variation, index) => {
              if (index === variations.length - 1) {
                return <Text key={index}>{variation}</Text>
              }
              return <Text key={index}>{variation} - </Text>
            })}
            </Text>
          )}
          {workingHours && (
            <Text>Opening hours: {workingHours.map((time, index) => (
              <WorkingHours key={index}>{time}</WorkingHours>
            ))}</Text>
          )}
        </ElevatedView>
      </Animated.View>
    )
  }
  
  renderMap = () => {
    const {productData} = this.props
    return (
      <View style={{height: '100%'}}>
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            zIndex: 1,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            transform: [{
              translateY: this.translateAnimatableHeaderY,
            }],
          }}
        >
          {this.renderHeaderCard()}
          {/*<Text style={{marginVertical: 20, fontSize: 17}}>Available at these locations: </Text>*/}
        </Animated.View>
        <View style={{flex: 1}}>
          <MapView
            provider={PROVIDER_GOOGLE}
            customMapStyle={customMapStyle}
            ref={ref => { this.map = ref; }}
            style={{
              width: '100%',
              height: '100%'
            }}
            initialRegion={{
              latitude: LATITUDE,
              longitude: LONGITUDE,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={{position: 'absolute', right: 0, top: 0, height: 50, width: 50}}
              onPress={() => this.fitAllMarkers()}
            >
              <Image
                style={{flex: 1, height: undefined, width: undefined}}
                resizeMode="contain"
                source={CenterMap}
              />
            </TouchableOpacity>
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
                <Text
                  style={{flex: 1, fontSize: 10, color: marker.selected ? '#FF799B' : '#7CC797', textAlign: 'center'}}
                >{marker.name}</Text>
              </View>
              </Marker>
            ))}
          </MapView>
          {this.renderStoreDetails()}
        </View>
      </View>
    )
  }
  
  render() {
    if (this.state.showList) {
      return this.renderList();
    }
    return this.renderMap();
  }
}
