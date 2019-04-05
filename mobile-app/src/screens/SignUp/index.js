// SignUp.js
import React, {Component} from 'react'
import {
  Image,
  Text,
  TouchableOpacity, View
} from 'react-native'
import firebase from 'react-native-firebase';
import {PageTitle, PageTitleWrapper, TextInputsWrapper,
  ButtonsWrapper, StyledButton, Container} from '../SignIn';
import {AccessToken, LoginManager} from "react-native-fbsdk";
import { reduxForm, Field, SubmissionError } from 'redux-form'
import TextInput from '../../components/TextInput';

import {goToSignIn, goToApp} from '../../navigation/methods';

export const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const nameValidation = (val) => {
  if (!val) {
    return 'Name field is required';
  }
  return undefined;
}

export const passwordValidation = (val) => {
  if (!val) {
    return 'Password field is required';
  }
  if (!(val.length >= 8)) {
    return 'Password must be at least 8 characters long';
  }
  return undefined;
}

export const emailValidation = (val) => {
  if (!val) {
    return 'Email field is required';
  }
  if (!emailRegex.test(val)) {
    return 'Email format is invalid';
  }
  return undefined;
}

const submit = values => {
  console.log('submitting form', values)
}

class SignUp extends Component {
  static get options() {
    return {
      topBar: { visible: false, height: 0, }
    };
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
  
  submit = async (values) => {
    const {name, email, password} = values
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      await firebase.database().ref(`users/${firebase.auth().currentUser.uid}`).update({name});
      // here place your signup logic
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        throw new SubmissionError({
          email: 'Email is already in use',
          _error: 'Registration failed!'
        })
      } else {
        throw new SubmissionError({
          email: 'Oops, something went wrong',
          _error: 'Registration failed!'
        })
      }
    }
  }
  
  render() {
    const {handleSubmit} = this.props;
    
    return (
      <Container>
        <PageTitleWrapper>
          <PageTitle>Create your</PageTitle>
          <PageTitle>account with email</PageTitle>
        </PageTitleWrapper>
        <TextInputsWrapper>
          <Field
            name="name"
            component={TextInput}
            validate={nameValidation}
            props={{
              label: 'Name',
              autoCapitalize: 'words',
              placeholderTextColor: '#C5CCD6'
            }}
          />
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
          <TouchableOpacity><Text>Terms of use and Privacy policy</Text></TouchableOpacity>
          <StyledButton onPress={handleSubmit(this.submit)}>
            <Text style={{color: 'white', paddingVertical: 15, textAlign: 'center'}}>
              Sign up with Email
            </Text>
          </StyledButton>
          <Text>Or</Text>
          <StyledButton
            onPress={() => this.loginFacebook()}
            blue
            disabled
          >
            <Image
              source={require(`../../../assets/facebook.png`)}
              style={{width: 18, height: 18, marginRight: 10}}
            />
            <Text style={{color: 'white', paddingVertical: 15, textAlign: 'center'}}>
              Sign up in with Facebook
            </Text>
          </StyledButton>
          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={{textAlign: 'center', marginBottom: 5, fontSize: 15, color: '#5B5B5B', marginRight: 5}}>Already have an account?</Text>
            <TouchableOpacity onPress={goToSignIn}>
              <Text style={{textAlign: 'center', marginBottom: 5, fontSize: 15, color: '#5B5B5B', fontWeight: 'bold'}}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ButtonsWrapper>
      </Container>
    )
  }
}

export default reduxForm({
  form: 'signUp',
})(SignUp)
