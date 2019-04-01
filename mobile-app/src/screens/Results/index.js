import React from 'react'
import _ from 'lodash';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux'
import {compose} from 'redux'
import {firebaseConnect, getVal} from 'react-redux-firebase'

import Map from '../../components/Map';
import StoresList from './components/StoresList';

const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(position => resolve(position), e => reject(e));
  });
};

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
};

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
    Navigation.events().bindComponent(this);
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
  };
  
  navigationButtonPressed({ buttonId }) {
    const {componentId} = this.props;
    if (buttonId === 'mapButton') {
      Navigation.mergeOptions(componentId, listNavOptions);
      return this.setState({showList: false});
    }
    if (buttonId === 'listButton') {
      Navigation.mergeOptions(componentId, mapNavOptions);
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
  
  applyNewFilters = newSizeRange => this.setState({sizesToDisplay: newSizeRange});
  
  onFiltersPress = () => {
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
  };
  
  renderList = () => {
    return (
      <StoresList
        onFiltersPress={this.onFiltersPress}
        productData={this.props.productData}
        sizesToDisplay={this.state.sizesToDisplay}
        onItemAdd={this.onItemAdd}
        onItemRemove={this.onItemRemove}
        savedItems={this.props.savedItems}
      />
    );
  };
  
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
