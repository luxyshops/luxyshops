import React, {Fragment} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import StoreCollapsible from './components/StoreCollapsible'
import Icon from 'react-native-vector-icons/FontAwesome';
import {responsiveFontSize as rf, responsiveHeight as rh, responsiveWidth as rw} from 'react-native-responsive-dimensions';
import _ from 'lodash';
import ElevatedView from 'react-native-elevated-view';
import customMapStyle from './customMapStyle';
import {Navigation} from 'react-native-navigation';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect, isLoaded, isEmpty, getVal } from 'react-redux-firebase'
import AvailableColors from './components/AvailableColors';
import Map from '../../components/Map';

import UnselectedPin from '../../../pin.png';
import SelectedPin from '../../../pink-pin.png';
import CenterMap from '../../../center-map.png';
import Cross from '../../../cross.png';
import styled from 'styled-components';

const { width, height } = Dimensions.get('window');

const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(position => resolve(position), e => reject(e));
  });
};
const WorkingHours = styled.Text`
  font-size: ${rf(1.5)}px;
  color: #C7CFD9;
  margin-bottom: 10px;
`

const listNavOptions = {
  topBar: {
    rightButtons: [
      {
        id: 'listButton',
        text: 'List',
        color: '#005840',
      }
    ],
    title: {
      text: 'Map',
    },
    background: {
      color: 'transparent',
    },
    drawBehind: true,
    transparent: true,
    translucent: false,
    hideOnScroll: false,
  },
}

const noRightButtonOptions = {
  topBar: {
    rightButtons: []
  }
}

const mapNavOptions = {
  topBar: {
    rightButtons: [
      {
        id: 'mapButton',
        text: 'Map',
        color: '#005840'
      }
    ],
    title: {
      text: 'Search results',
    },
    background: {
      color: 'transparent',
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


class Results extends React.Component {
  static get options() {
    return {
      topBar: {
        backButton: { // android
          color: "black",
          title: ''
        },
        rightButtons: [
          {
            id: 'mapButton',
            text: 'Map',
            color: '#005840'
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
    
    const initialState = {
      rightNavBarButton: 'mapButton',
      showList: true,
      markers: this.markers(),
      userLocation: null,
      allFiltersUnChecked: true,
      sizesToDisplay: props.productData.sizes_reference,
    };
    
    props.productData.stores_in_stock.forEach((store, idx) => initialState[`collapse${idx}`] = true);
    Navigation.events().bindComponent(this);
    this.translateAnimatableButtonY = new Animated.Value(rh(20));
    this.animatableButtonOpacity = new Animated.Value(0);
    this.translateAnimatableHeaderY = new Animated.Value(0);
    this.animatableHeaderOpacity = new Animated.Value(1);
    this.translateAnimatableCenterButtonY = new Animated.Value(rh(40));
    this.state = initialState
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
  
  lowerCenterButton = () => {
    return Animated.spring(this.translateAnimatableCenterButtonY, {
      toValue: 300,
      duration: 1,
      useNativeDriver: true,
    });
  }
  
  raiseCenterButton = () => {
    return Animated.spring(this.translateAnimatableCenterButtonY, {
      toValue: 0,
      duration: 1,
      useNativeDriver: true,
    });
  }
  
  hideHeader = () => {
    Navigation.mergeOptions(this.props.componentId, noRightButtonOptions);
    return Animated.parallel([
      Animated.spring(this.translateAnimatableHeaderY, {
        toValue: -rh(40),
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
        toValue: rh(40),
        duration: 1,
        useNativeDriver: true,
      })
    ]).start(() => {
      Navigation.mergeOptions(this.props.componentId, listNavOptions);
      this.setState({ markers: this.markers() })
    });
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
  
  onItemAdd = () => {
    const {user, barcode} = this.props;
    const path = `users/${user.uid}/savedItems`
    return this.props.firebase.push(path, {barcode})
  }
  
  onItemRemove = (savedKey) => {
    const {user} = this.props;
    const path = `users/${user.uid}/savedItems/${savedKey}`
    return this.props.firebase.remove(path)
  }
  
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
            source={require('../../../assets/shoe_icon.png')}
          />
        )
      case 'kitchen':
      case 'food':
        return (
          <Image
            style={imageStyles}
            resizeMode="contain"
            source={require('../../../assets/food_icon.png')}
          />
        )
      case 'toy':
        return (
          <Image
            style={imageStyles}
            resizeMode="contain"
            source={require('../../../assets/toy_icon.png')}
          />
        )
      case 'interior':
        return (
          <Image
            style={imageStyles}
            resizeMode="contain"
            source={require('../../../assets/interiour_icon.png')}
          />
        )
      default:
        return (
          <Image
            style={imageStyles}
            resizeMode="contain"
            source={require('../../../assets/clothing_icon.png')}
          />
        )
    }
  }
  
  renderHeaderCard = () => {
    const {bar_codes, type} = this.props.productData;
    const isSaved = _.keys(this.props.savedItems).find((itemKey) => {
      return bar_codes.includes(_.get(this.props.savedItems, `${itemKey}.barcode`));
    });
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
          <TouchableOpacity onPress={isSaved ? () => this.onItemRemove(isSaved) : this.onItemAdd}>
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
  
  renderStores = () => {
    const {productData} = this.props
    return (
      <View style={{marginBottom: 20}}>
        {productData.stores_in_stock.map((store, idx) => {
          const {sizes_available} = store;
          if (!sizes_available || sizes_available.some(r=> this.state.sizesToDisplay.indexOf(r) >= 0)) {
            return (
              <StoreCollapsible
                collapsed={this.state[`collapse${idx}`]}
                onCollapse={() => this.setState({[`collapse${idx}`]: !this.state[`collapse${idx}`]})}
                {...store}
                key={idx}
              />
            );
          }
        })}
      </View>
    )
  }
  
  applyNewFilters = (newSizeRange) => {
    console.log('newSizeRange', newSizeRange)
    this.setState({sizesToDisplay: newSizeRange})
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
         <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
           <Text style={{marginVertical: 20, fontSize: 17}}>Available at these locations: </Text>
           {_.get(this.props, 'productData.sizes_reference', null) && (
             <TouchableOpacity
               onPress={() => {
                 return Navigation.push(this.props.componentId, {
                   component: {
                     name: 'Filters',
                     passProps: {
                       sizes_reference: _.get(this.props, 'productData.sizes_reference'),
                       sizes_to_display: this.state.sizesToDisplay,
                       allUnChecked: this.state.allFiltersUnChecked,
                       onApply: this.applyNewFilters,
                       onReset: () => this.setState({allFiltersUnChecked: true})
                     },
                     options: {
                       bottomTabs: { visible: false, drawBehind: true, animate: true }
                     }
                   },
                 }).then(() => {
                   if (this.state.allFiltersUnChecked) {
                     return this.setState({allFiltersUnChecked: false})
                   }
                 })
               }}
               style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
             >
               <Image
                 source={require('../../../assets/filters_icon.png')}
                 style={{width: rh(3), height: rh(3), marginRight: rw(3)}}
               />
               <Text style={{color: '#175641', fontSize: rf(2)}}>Filters</Text>
             </TouchableOpacity>
           )}
         </View>
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
    return (
      <View style={{height: '100%'}}>
        <Animated.View
          style={{
            position: 'absolute',
            right: 0,
            zIndex: 1,
            transform: [{
              translateY: this.translateAnimatableCenterButtonY
            }]
          }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              height: 60,
              width: 60,
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
          <ElevatedView style={{paddingHorizontal: 20,
            paddingTop: 70,
            paddingBottom: 50,
            backgroundColor: 'white'}} elevation={5}>
            {this.renderHeaderCard()}
            <Text style={{fontSize: 15}}>Available at these locations: </Text>
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
  
  goToFilters = ({onApply: applyFiltersToMap}) => {
    return Navigation.push(this.props.componentId, {
      component: {
        name: 'Filters',
        passProps: {
          sizes_reference: _.get(this.props, 'productData.sizes_reference'),
          sizes_to_display: this.state.sizesToDisplay,
          allUnChecked: this.state.allFiltersUnChecked,
          onApply: (sizeref) => {
            this.applyNewFilters(sizeref);
            applyFiltersToMap();
          },
          onReset: () => {
            this.setState({allFiltersUnChecked: true})
            applyFiltersToMap()
          }
        },
        options: {
          bottomTabs: { visible: false, drawBehind: true, animate: true }
        }
      },
    }).then(() => {
      if (this.state.allFiltersUnChecked) {
        return this.setState({allFiltersUnChecked: false})
      }
    })
  }
  
  render() {
    if (this.state.showList) {
      return this.renderList();
    }
    return (
      <Map
        savedItems={this.props.savedItems}
        goToFilters={this.goToFilters}
        onItemAdd={this.onItemAdd}
        onItemRemove={(savedKey) => this.onItemRemove(savedKey)}
        productData={this.props.productData}
        applyNewFilters={this.applyNewFilters}
        onReset={() => this.setState({allFiltersUnChecked: true})}
        allUnChecked={this.state.allFiltersUnChecked}
        sizes_to_display={this.state.sizesToDisplay}
        sizes_reference={_.get(this.props, 'productData.sizes_reference')}
      />
    )
  }
}


export default compose(
  firebaseConnect([
    'productFamilies',
    'users'
  ]),
  connect((state) => ({
    productFamilies: state.firebase.data.productFamilies,
    user: state.firebase.auth,
    savedItems: getVal(state.firebase, `data/users/${state.firebase.auth.uid}/savedItems`)
  }))
)(Results)
