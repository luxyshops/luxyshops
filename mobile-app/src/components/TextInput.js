import React, {Component} from 'react';
import {TextInput as RNTExtInput, Text, View, Image} from 'react-native';
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
  
  state = {};
  
  renderError = () => {
    const {meta: {pristine, active, error, touched}} = this.props;
    if ((!pristine || touched) && !active && error) {
      return (
        <ErrorText>{error}</ErrorText>
      )
    }
    return null;
  };
  
  renderIcon = () => {
    const {meta} = this.props;
  
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
  
  render () {
    const { input, meta, ...inputProps } = this.props;
    let borderColor = '#C5CCD6';
    if (!meta.pristine && !meta.active && meta.error) {
      borderColor = '#FF3B30';
    }
    if (!meta.pristine && !meta.error) {
      borderColor = '#7CC797';
    }
    return (
      <InputWrapper>
        {this.renderError()}
        <View style={{position: 'relative'}}>
          <StyledInput
            {...inputProps}
            onChangeText={input.onChange}
            onBlur={input.onBlur}
            onFocus={input.onFocus}
            value={input.value}
            borderColor={borderColor}
          />
          {this.renderIcon()}
        </View>
      </InputWrapper>
    );
  }
}

export default TextInput;
