import React, {Fragment} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from 'react-native'
import StoreCollapsible from './components/StoreCollapsible'
import Icon from 'react-native-vector-icons/FontAwesome';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import ElevatedView from 'react-native-elevated-view';
import customMapStyle from './customMapStyle';
import {Navigation} from 'react-native-navigation';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

const listNavOptions = {
  topBar: {
    rightButtons: [
      {
        id: 'listButton',
        text: 'List'
      }
    ],
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
    drawBehind: true,
    transparent: true,
    translucent: true,
    hideOnScroll: true,
  }
}

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
    const initialState = {rightNavBarButton: 'mapButton', showList: true}
    props.productData.stores_in_stock.forEach((store, idx) => initialState[`collapse${idx}`] = true);
    Navigation.events().bindComponent(this);
    this.state = initialState
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
        <Text style={{fontSize: 10, color: '#C7CFD9'}}>Style: {this.props.productData.style}</Text>
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
  
  renderMap = () => {
    return (
      <View style={{height: '100%'}}>
        <View style={{flex: 2, padding: 20}}>
          {this.renderHeaderCard()}
          <Text style={{marginVertical: 20, fontSize: 17}}>Available at these locations: </Text>
        </View>
        <View style={{flex: 5}}>
          <MapView
            provider={PROVIDER_GOOGLE}
            customMapStyle={customMapStyle}
            style={{
              width: '100%',
              height: '100%'
            }}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
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
