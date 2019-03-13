import React, {Component} from 'react';
import {
  View, KeyboardAvoidingView, StatusBar,
  Animated, Easing, TouchableOpacity, StyleSheet,
} from 'react-native';

import Text from '../../components/Text';
import Carousel from './Carousel';
import SliderEntry from './SliderEntry';
import {ButtonsWrapper, StyledButton} from '../../components/Button';

import data from './data';

import {
  responsiveFontSize as rf,
  responsiveHeight as rh,
  responsiveWidth as rw,
} from 'react-native-responsive-dimensions';

const styles = StyleSheet.create({
  imgBg: {
    width: '100%',
    height: '100%',
  },
  animatedView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  skipButtonContainer: {
    zIndex: 1,
    width: '95%',
    alignItems: 'flex-end',
    marginTop: 23,
    opacity: 0.7,
  },
  skipButtonText: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    color: 'white',
  },
  slide: {
    position: 'absolute',
    top: 0,
    borderWidth: 1,
    borderColor: 'red',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: rw(75),
    flexDirection: 'row',
    marginBottom: rh(9),
    flex: 0.6,
  },
  button: {
    width: '100%',
    height: rh(6),
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: rf(2),
  },
});

class Walkthrough extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'welcome',
      pageIndex: 0,
    }
    this.animatedValue = new Animated.Value(0);
  }
  
  static get options() {
    return {
      topBar: { visible: false, height: 0, }
    };
  }
  
  
  componentDidMount() {
    this.animate(0);
  }
  
  animate = (duration) => {
    this.animatedValue.setValue(0);
    Animated.timing(
      this.animatedValue,
      {toValue: 1, duration, easing: Easing.linear},
    ).start();
  };
  
  renderItem = ({item}) => <SliderEntry data={item} />;
  
  handleButtonPress = () => {
    return null;
  };
  
  renderSkipButton = () => (
    <TouchableOpacity
      style={styles.skipButtonContainer}
      onPress={() => this.props.navigation.navigate('Authentication')}
    >
      <Text style={styles.skipButtonText}>Skip</Text>
    </TouchableOpacity>
  );
  
  render() {
    const {page} = this.state;
    const animatedBgColor = page === 'welcome' ? '#FFC0C5' : '#B39EE6';
    const opacity = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });
    
    return (
      <View style={styles.imgBg}>
        <Carousel
          numOfDots={data.entries.length}
          data={data.entries}
          activeSlide={this.state.pageIndex}
          onButtonPress={() => this.carousel.snapToNext()}
          getRef={c => this.carousel = c}
          renderItem={this.renderItem}
          onSnapToItem={(idx) => {
            this.animate(500);
            this.setState({page: idx === 0 ? 'welcome' : 'overview', pageIndex: idx});
          }}
        />
      </View>
    );
  }
}

export default Walkthrough;
