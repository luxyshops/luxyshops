import React, {Component} from 'react';
import {TextInput as RNTExtInput, Animated, View, Image} from 'react-native';
import styled from "styled-components";
import {
  responsiveFontSize as rf,
  responsiveHeight as rh,
  responsiveWidth as rw
} from 'react-native-responsive-dimensions';

const InputWrapper = styled.View`
  width: 100%;
`;

const ErrorText = styled.Text`
  padding-horizontal: ${rw(2.5)}px;
  font-size: ${rf(1.5)}px;
  color: #FF3B30;
`

const StyledInput = styled(RNTExtInput)`
  width: 100%;
  font-size: ${rf(2)}px;
  font-weight: 500;
  height: ${rh(7)}px;
  margin-top: ${rh(1)}px;
  margin-bottom: ${rh(1)}px;
  border-bottom-width: 1px;
  border-color: ${props => props.borderColor};
  padding-vertical: ${rh(2)}px;
  padding-horizontal: ${rw(2.5)}px;
  border-radius: 14px;
`;

class TextInput extends Component {
  static defaultProps = {};
  
  static propTypes = {};
  
  constructor(props) {
    super(props);
    this._animatedIsFocused = new Animated.Value(props.input.value === '' ? 0 : 1);
    this.state = {isFocused: false}
  }
  
  componentDidMount() {
    this._animatedIsFocused = new Animated.Value(this.props.input.value === '' ? 0 : 1);
  }
  
  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: (this.state.isFocused || this.props.input.value !== '') ? 1 : 0,
      duration: 200,
    }).start();
  }
  
  renderError = () => {
    const {meta: {pristine, active, error, touched}, noErrorValidation} = this.props;
    if ((!pristine || touched) && !active && error) {
      return (
        <ErrorText>{error}</ErrorText>
      )
    }
    return null;
  };
  
  renderIcon = () => {
    const {meta, noErrorValidation} = this.props;
    
    if (!meta.pristine && !meta.error) {
      return (
        <Image
          source={require('../../assets/form-checkmark.png')}
          style={{width: rh(3), height: rh(2), position: 'absolute', right: rw(3), top: rh(3)}}
        />
      )
    }
    
    if ((!meta.pristine || meta.touched) && !meta.active && meta.error) {
      return (
        <Image
          source={require('../../assets/form-error.png')}
          style={{width: rh(2.5), height: rh(2.5), position: 'absolute', right: rw(3), top: rh(3)}}
        />
      )
    }
    return null;
  }
  
  onBlur = () => {
    this.setState({isFocused: false})
    this.props.input.onBlur();
  }
  
  onFocus = () => {
    this.setState({isFocused: true})
    this.props.input.onFocus();
  }
  
  render () {
    const { input, meta, label, noErrorValidation, ...inputProps } = this.props;
    let borderColor = '#C5CCD6';
    if (!noErrorValidation) {
      if (!meta.pristine && !meta.active && meta.error) {
        borderColor = '#FF3B30';
      }
      if (!meta.pristine && !meta.error) {
        borderColor = '#005840';
      }
    }
  
    const labelStyle = {
      position: 'absolute',
      left: rw(3),
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [rf(2), rf(1.7)],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#aaa', '#aaa'],
      }),
    };
    
    return (
      <InputWrapper>
        {!noErrorValidation && this.renderError()}
        <View style={{position: 'relative'}}>
          <Animated.Text style={labelStyle}>
            {label}
          </Animated.Text>
          <StyledInput
            {...inputProps}
            onChangeText={input.onChange}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            value={input.value}
            borderColor={borderColor}
            blurOnSubmit
          />
          {!noErrorValidation && this.renderIcon()}
        </View>
      </InputWrapper>
    );
  }
}

export default TextInput;
