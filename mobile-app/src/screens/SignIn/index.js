import React, {Component} from 'react'
import {
  Image,
  Text,
  TouchableOpacity, View,
} from 'react-native';
import firebase from 'react-native-firebase';
import styled from 'styled-components';
import {responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf} from 'react-native-responsive-dimensions';
import {LoginButton, AccessToken, LoginManager} from 'react-native-fbsdk';
import { reduxForm, Field, SubmissionError } from 'redux-form'

import TextInput from '../../components/TextInput';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import {emailValidation, passwordValidation} from '../SignUp';

import { goToSignUp, goToApp, goToWalkthrough } from '../../navigation/methods'

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
  background-color: ${({blue}) => blue ? '#00546B' : '#005840'};
  border-radius: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-shadow: 0 ${({blue}) => blue ? '5' : '10'}px 10px ${({blue}) => blue ? 'rgba(0, 84, 107, 0.6)' : 'rgba(0, 88, 64, 0.6)'};
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

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '', password: '', val: ''
    }
  }
  
  static get options() {
    return {
      topBar: { visible: false, height: 0, }
    };
  }
  
  onChangeText = (key, value) => {
    this.setState({ [key]: value })
  }
  
  signIn = async (values) => {
    const { email, password } = values
    try {
      // login with provider
      await firebase.auth().signInWithEmailAndPassword(email, password)
      return goToApp();
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        throw new SubmissionError({
          email: 'User does not exist',
          _error: 'Login failed!'
        })
      } else if (err.code === 'auth/wrong-password') {
        throw new SubmissionError({
          password: 'Wrong password',
          _error: 'Login failed!'
        })
      } else {
        throw new SubmissionError({
          email: 'Oops, something went wrong',
          _error: 'Login failed!'
        })
      }
    }
  }
  
  loginFacebook = async () => {
    this.setState({facebookLoading: true});
    try {
      const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);
      if (result.isCancelled) {
        // handle this however suites the flow of your app
        return this.setState({facebookLoading: false})
      }
      const data = await AccessToken.getCurrentAccessToken();
      
      if (!data) {
        // handle this however suites the flow of your app
        throw new Error('Something went wrong obtaining the users access token');
      }
      const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
      const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);
      const userRef = firebase.database().ref(`users/${firebaseUserCredential.user.uid}`);
      const userData = await userRef.once('value').then(snapshot => snapshot.val());
      if (!userData) {
        await userRef.update({name: firebaseUserCredential.user.displayName});
      }
      goToApp()
    } catch (e) {
      this.setState({facebookLoading: false});
      console.error(e);
    }
  };
  
  render() {
    const {handleSubmit} = this.props;
    return (
      <Container>
        <PageTitleWrapper>
          <PageTitle>Log into</PageTitle>
          <PageTitle>your account</PageTitle>
        </PageTitleWrapper>
        <TextInputsWrapper>
          <Field
            name="email"
            component={TextInput}
            validate={emailValidation}
            props={{
              label: 'Email',
              autoCapitalize: 'none',
              placeholderTextColor: '#C5CCD6'
            }}
          />
          <Field
            name="password"
            component={TextInput}
            validate={passwordValidation}
            props={{
              label: 'Password',
              autoCapitalize: 'none',
              secureTextEntry: true,
              placeholderTextColor: '#C5CCD6'
            }}
          />
        </TextInputsWrapper>
        <ButtonsWrapper>
          <TouchableOpacity>
            <Text>Terms of use and Privacy policy</Text>
          </TouchableOpacity>
          <StyledButton
            activeOpacity={0.8}
            onPress={handleSubmit(this.signIn)}
          >
            <Text style={{color: 'white', paddingVertical: rh(2), textAlign: 'center'}}>Log in</Text>
          </StyledButton>
          <Text>Or</Text>
          <StyledButton
            disabled
            blue
            onPress={() => this.loginFacebook()}
          >
            <Image
              source={require(`../../../assets/facebook.png`)}
              style={{width: 18, height: 18, marginRight: 10}}
            />
            <Text style={{color: 'white', paddingVertical: rh(2), textAlign: 'center'}}>
              Log in with Facebook
            </Text>
          </StyledButton>
          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={{textAlign: 'center', marginBottom: 5, fontSize: 15, color: '#5B5B5B', marginRight: 5}}>Not registered yet?</Text>
            <TouchableOpacity onPress={goToSignUp}>
              <Text style={{textAlign: 'center', marginBottom: 5, fontSize: 15, color: '#5B5B5B', fontWeight: 'bold'}}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ButtonsWrapper>
      </Container>
    )
  }
}

export default reduxForm({
  form: 'signIn',
})(SignIn)
