import React, {Component} from 'react'
import {
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import firebase from 'react-native-firebase';
import styled from 'styled-components';
import {responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf} from 'react-native-responsive-dimensions';

import { goToScanner } from '../../navigation/methods'

export const PageTitle = styled.Text`
  font-size: ${rf(4)}px;
  font-weight: 600;
`;

export const PageTitleWrapper = styled.View`
 width: 100%;
 flex: 1;
 display: flex;
 justify-content: flex-end;
`;

export const TextInputsWrapper = styled.View`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export const ButtonsWrapper = styled.View`
  flex: 1;
  width: 100%;
  justify-content: space-evenly;
  align-items: center;
`;

export const StyledButton = styled(TouchableOpacity)`
  background-color: ${({blue}) => blue ? '#0079FF' : '#61CA93'};
  border-radius: 50px;
  width: 100%;
  box-shadow: 0 ${({blue}) => blue ? '5' : '10'}px 10px ${({blue}) => blue ? 'rgba(0, 121, 255, 0.6)' : 'rgba(97, 202, 147, 0.6)'};
`;

export const StyledInput = styled(TextInput)`
  width: 100%;
  font-size: ${rf(2)}px;
  font-weight: 500;
  height: ${rh(7)}px;
  margin-top: ${rh(1)}px;
  margin-bottom: ${rh(1)}px;
  border-bottom-width: 1px;
  border-color: #C5CCD6;
  padding-vertical: ${rh(2)}px;
  padding-horizontal: ${rw(2.5)}px;
  border-radius: 14px;
`;

export const Container = styled.View`
  display: flex;
  flex-direction: column;
  padding-horizontal: ${rw(9)}px;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default class SignIn extends Component {
  state = {
    email: '', password: ''
  }
  
  onChangeText = (key, value) => {
    this.setState({ [key]: value })
  }
  
  signIn = async () => {
    const { email, password } = this.state
    try {
      // login with provider
      const user = await firebase.auth().signInWithEmailAndPassword(email, password)
      console.log('user successfully signed in!', user)
      goToScanner()
    } catch (err) {
      console.log('error:', err)
    }
  }
  
  render() {
    return (
      <Container>
        <PageTitleWrapper>
          <PageTitle>Log into</PageTitle>
          <PageTitle>your account</PageTitle>
        </PageTitleWrapper>
        <TextInputsWrapper>
          <StyledInput
            placeholder='Email'
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor='#C5CCD6'
            onChangeText={val => this.onChangeText('email', val)}
          />
          <StyledInput
            placeholder='Password'
            autoCapitalize="none"
            secureTextEntry={true}
            placeholderTextColor='#C5CCD6'
            onChangeText={val => this.onChangeText('password', val)}
          />
        </TextInputsWrapper>
        <ButtonsWrapper>
          <TouchableOpacity>
            <Text>Terms of use and Privacy policy</Text>
          </TouchableOpacity>
          <StyledButton
            activeOpacity={0.8}
            onPress={this.signIn}
          >
            <Text style={{color: 'white', paddingVertical: rh(2), textAlign: 'center'}}>Log in</Text>
          </StyledButton>
          <Text>Or</Text>
          <StyledButton
            blue
            onPress={() => null}
          >
            <Text style={{color: 'white', paddingVertical: rh(2), textAlign: 'center'}}>
              Log in with Facebook
            </Text>
          </StyledButton>
        </ButtonsWrapper>
      </Container>
    )
  }
}
