// SignUp.js
import React, {Component} from 'react'
import {
  Text,
  TouchableOpacity
} from 'react-native'
import firebase from 'react-native-firebase';
import {PageTitle, PageTitleWrapper, TextInputsWrapper,
  ButtonsWrapper, StyledButton, StyledInput, Container} from '../SignIn';

export default class SignUp extends Component {
  state = {
    name: '', password: '', email: '',
  }
  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }
  signUp = async () => {
    const {name, email, password} = this.state
    try {
      const user = await firebase.auth().createUserWithEmailAndPassword(email, password);
      await firebase.database().ref(`users/${firebase.auth().currentUser.uid}`).update({name});
      // here place your signup logic
      console.log('user', user)
    } catch (err) {
      console.log('error signing up: ', err)
    }
  }
  
  render() {
    return (
      <Container>
        <PageTitleWrapper>
          <PageTitle>Create your</PageTitle>
          <PageTitle>account with email</PageTitle>
        </PageTitleWrapper>
        <TextInputsWrapper>
          <StyledInput
            placeholder='Name'
            autoCapitalize='words'
            placeholderTextColor='#C5CCD6'
            onChangeText={val => this.onChangeText('name', val)}
          />
          <StyledInput
            placeholder='Email'
            autoCapitalize="none"
            placeholderTextColor='#C5CCD6'
            onChangeText={val => this.onChangeText('email', val)}
          />
          <StyledInput
            placeholder='Password'
            secureTextEntry={true}
            autoCapitalize="none"
            placeholderTextColor='#C5CCD6'
            onChangeText={val => this.onChangeText('password', val)}
          />
        </TextInputsWrapper>
        <ButtonsWrapper>
          <TouchableOpacity><Text>Terms of use and Privacy policy</Text></TouchableOpacity>
          <StyledButton onPress={this.signUp}>
            <Text style={{color: 'white', paddingVertical: 15, textAlign: 'center'}}>
              Sign up with Email
            </Text>
          </StyledButton>
          <Text>Or</Text>
          <StyledButton
            onPress={() => null}
            blue
          >
            <Text style={{color: 'white', paddingVertical: 15, textAlign: 'center'}}>
              Sign up in with Facebook
            </Text>
          </StyledButton>
        </ButtonsWrapper>
      </Container>
    )
  }
}
