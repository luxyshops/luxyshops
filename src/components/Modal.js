import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Text, TouchableOpacity, View} from "react-native";
import {
  responsiveFontSize as rf,
  responsiveHeight as rh,
  responsiveWidth as rw
} from 'react-native-responsive-dimensions';
import styled from 'styled-components';
import RNModal from 'react-native-modal';

const ModalOuterWrapper = styled.View`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const ModalInnerWrapper = styled.View`
  background-color: white;
  padding: ${rh(4)}px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ModalTitle = styled.Text`
  font-size: ${rf(3)};
  font-weight: bold;
  text-align: center;
  margin-bottom: ${rh(2)};
`;

const ModalSubTitle = styled.Text`
  font-size: ${rf(2)};
  font-weight: 400;
  text-align: center;
  margin-bottom: ${rh(2)};
`;

const ModalButtonsWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const ModalButton = styled(TouchableOpacity)`
  background-color: ${({blue}) => blue ? '#00546B' : '#005840'};
  width: ${rw(30)}px;
  border-radius: 30px;
`;

const ModalButtonText = styled.Text`
  color: white;
  margin-top: ${rh(1.8)}px;
  margin-bottom: ${rh(1.8)}px;
  text-align: center;
  font-size: ${rf(2)}px;
  font-weight: 600;
`;

class Modal extends Component {
  static defaultProps = {
    onBackdropPress: () => null,
    title: '',
    subtitle: '',
    leftButtonText: '',
    rightButtonText: '',
  };
  
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onBackdropPress: PropTypes.func,
    onRightButtonPress: PropTypes.func.isRequired,
    onLeftButtonPress: PropTypes.func.isRequired,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    leftButtonText: PropTypes.string,
    rightButtonText: PropTypes.string,
  };
  
  state = {};
  
  render () {
    const {
      isVisible,
      onBackdropPress,
      onRightButtonPress,
      onLeftButtonPress,
      title,
      subtitle,
      leftButtonText,
      rightButtonText,
    } = this.props;
    return (
      <View>
        <RNModal
          backdropColor="#27737E"
          backdropOpacity={0.9}
          useNativeDriver
          onBackdropPress={onBackdropPress}
          isVisible={isVisible}
        >
          <ModalOuterWrapper>
            <ModalInnerWrapper>
              <ModalTitle>{title}</ModalTitle>
              <ModalSubTitle>
                {subtitle}
              </ModalSubTitle>
              <ModalButtonsWrapper>
                <ModalButton
                  activeOpacity={0.8}
                  onPress={onLeftButtonPress}
                  blue
                >
                  <ModalButtonText>{leftButtonText}</ModalButtonText>
                </ModalButton>
                <ModalButton
                  onPress={onRightButtonPress}
                  activeOpacity={0.8}
                >
                  <ModalButtonText>{rightButtonText}</ModalButtonText>
                </ModalButton>
              </ModalButtonsWrapper>
            </ModalInnerWrapper>
          </ModalOuterWrapper>
        </RNModal>
      </View>
    );
  }
}

export default Modal;
