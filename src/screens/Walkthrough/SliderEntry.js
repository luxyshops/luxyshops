import React, {Component} from 'react';
import {View, Image, Text} from 'react-native';
import PropTypes from 'prop-types';
import ElevatedView from 'react-native-elevated-view';
import {StyleSheet, Platform, Dimensions} from 'react-native';
import {
  responsiveFontSize as rf,
  responsiveHeight as rh,
  responsiveWidth as rw,
} from 'react-native-responsive-dimensions';

const IS_IOS = Platform.OS === 'ios';

const slideHeight = rh(50);
const slideWidth = rw(100);
const itemHorizontalMargin = rh(1);

export const sliderWidth = Dimensions.get('window').width;
export const itemWidth = slideWidth

const entryBorderRadius = 8;

const styles = StyleSheet.create({
  slideInnerContainer: {
    width: itemWidth,
    paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 18,
    height: rh(54),
    marginTop: rh(7),
  },
  container: {
    backgroundColor: 'white',
    borderRadius: entryBorderRadius,
    display: 'flex',
    alignItems: 'center',
  },
  image: {
    borderRadius: IS_IOS ? entryBorderRadius : 0,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
    width: '100%',
    height: slideHeight / 1.8,
    marginTop: -10,
  },
  textContainer: {
    marginTop: 15,
    marginBottom: 30,
    width: '85%',
  },
  title: {
    fontSize: rf(2.6),
  },
  mainText: {
    fontSize: rf(1.8),
    color: '#6D6D6D',
    width: '89.5%',
    marginTop: 8,
    lineHeight: 20,
  },
});

export default class SliderEntry extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };
  
  renderIllustration = illustration => <Image source={illustration} style={styles.image} />;
  
  render() {
    const {data: {title, index, text}} = this.props;
    
    return (
      <View
        elevation={7}
        style={{
          width: itemWidth,
          paddingBottom: 18,
          height: rh(50),
          borderRadius: 10,
          marginTop: rh(7),
        }}
      >
        {index === 0 ? (
          <View style={{width: '100%', display: 'flex', alignItems: 'center'}}>
            <Image
              source={require(`../../../assets/walkthrough_first.png`)}
              style={{width: rw(84), height: rh(47)}}
            />
          </View>
        ) : (
          <View style={{width: '100%', display: 'flex', alignItems: 'center'}}>
            <Image
              source={require(`../../../assets/walkthrough_second.png`)}
              style={{width: rw(84), height: rh(47)}}
            />
          </View>
        )}
      </View>
      
    );
  }
}
