import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Image, ScrollView, TouchableOpacity, View, Text} from 'react-native';
import _ from 'lodash';
import {
  responsiveFontSize as rf,
  responsiveHeight as rh,
  responsiveWidth as rw
} from 'react-native-responsive-dimensions';
import styled from 'styled-components';

import HeaderCard from './HeaderCard';
import StoreCollapsible from './StoreCollapsible';

const HeaderControlsWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LocationText = styled.Text`
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 17px;
`;

const FiltersTouchableWrapper = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const FiltersImage = styled(Image)`
  width: ${rh(3)}px;
  height: ${rh(3)}px;
  margin-right: ${rw(3)}px;
`;

const FiltersText = styled.Text`
  color: #175641;
  font-size: ${rf(2)}px;
`;

class StoresList extends Component {
  static defaultProps = {};
  
  static propTypes = {
    onFiltersPress: PropTypes.func.isRequired,
  };
  
  constructor (props) {
    super(props);
    const initialState = {};
    props.productData.stores_in_stock.forEach((store, idx) => initialState[`collapse${idx}`] = true);
    this.state = initialState;
  }
  
  renderHeaderCard = () => {
    const {productData, savedItems, onItemRemove, onItemAdd} = this.props;
    const {bar_codes, type} = productData;
    const isSaved = _.keys(savedItems).find((itemKey) => {
      return bar_codes.includes(_.get(savedItems, `${itemKey}.barcode`));
    });
    const onHeartPress = isSaved ? () => onItemRemove(isSaved) : () => onItemAdd();
    const iconName = isSaved ? 'heart' : 'heart-o';
    
    return (
      <HeaderCard
        productData={productData}
        onHeartPress={onHeartPress}
        iconName={iconName}
        type={type}
      />
    );
  };
  
  renderStores = () => {
    const {productData, userLocation, sizesToDisplay} = this.props
    
    if (_.get(this.props, 'productData.sizes_reference')) {
      const storesThatWillBeDisplayed = productData.stores_in_stock.filter((store, idx) => store.sizes_available.some(r=> sizesToDisplay.indexOf(r) >= 0));
      if (storesThatWillBeDisplayed.length === 0) {
        return <Text>We are sorry. There is nothing found</Text>
      }
    }
    
    return (
      <View style={{marginBottom: 20}}>
        {productData.stores_in_stock.map((store, idx) => {
          const {sizes_available} = store;
          if (!sizes_available || sizes_available.some(r=> sizesToDisplay.indexOf(r) >= 0)) {
            return (
              <StoreCollapsible
                userLocation={userLocation}
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
  
  render () {
    const {onFiltersPress} = this.props;
    return (
      <ScrollView
        contentContainerStyle={{backgroundColor: '#FCFCFC'}}
      >
        <View style={{padding: 20}}>
          {this.renderHeaderCard()}
          <HeaderControlsWrapper>
            <LocationText>Available at these locations: </LocationText>
            {_.get(this.props, 'productData.sizes_reference', null) && (
              <FiltersTouchableWrapper onPress={onFiltersPress}>
                <FiltersImage
                  source={require('../../../../assets/filters_icon.png')}
                />
                <FiltersText>Filters</FiltersText>
              </FiltersTouchableWrapper>
            )}
          </HeaderControlsWrapper>
          {this.renderStores()}
        </View>
      </ScrollView>
    );
  }
}

export default StoresList;
