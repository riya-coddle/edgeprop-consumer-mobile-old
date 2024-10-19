import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  ScrollView,
  Dimensions,
  ImageBackground,
  TextInput, 
  TouchableOpacity,
  AsyncStorage  
} from 'react-native';
import {HeaderBackButton } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Loading from '../../components/Common_Loading/Common_Loading'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
//import SignUp from '../../app/SignUp/SignUp_1.js'
//import AppNav from '../../app/AppNav.js'
import SocialLogin from '../../app/SocialLogin/SocialLogin.js'
import styles from './AuthenticationStyle.js'
import ForgotPassword from '../../app/ForgotPassword/ForgotPassword.js'

const HOSTNAME = 'https://www.edgeprop.my/jwdalice/api/user/v1/login';
import { NavigationActions} from 'react-navigation'

var backIcon = require('../../assets/icons/left-arrow.png');
var emailValidate = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var phoneBasicValidate = /^(?=\d{9,}$)\d{9,10}/;
var phoneValidate = /^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/;

const {width, height} = Dimensions.get('window');

export default class Authentication extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      header: null
      };
  };
  
  constructor(props) {
    	super(props);
      this.navigation = props.navigation;
      let params = this.props.navigation.state.params.data;
    	this.state = {
        email:'',
        pass: '',
        hasPassError: false,
        hasEmailError: false,
        isSignUp: false,
        timePassed: false,
        hasAuthError: false,
        hasLoggedIn: false,
        forgotPassword: false,
        itemSelected: params.itemSelected,
        asycCheck: 0
      };
      this._onPressButton = this._onPressButton.bind(this)
      this._onBackPress = this._onBackPress.bind(this)
      this.setTimePassed = this.setTimePassed.bind(this)
      this._login = this._login.bind(this)
      this._setAuthAsyc = this._setAuthAsyc.bind(this)
      this._onForgotPassword = this._onForgotPassword.bind(this)
      this._goBack = this._goBack.bind(this)
      this._backToHome = this._backToHome.bind(this);
      this._setLoader = this._setLoader.bind(this);
      this._onPressButton1 = this._onPressButton1.bind(this)
  }

  componentDidMount() {
    setTimeout( () => {
       this.setTimePassed();
    },4000);
    
    if(this.props.loggedOut) {
      this.setState({ hasLoggedIn: false });
    }
  }

  _setLoader(flag) {
      this.setState({ asycCheck: flag });
    }

  setTimePassed() {
       this.setState({timePassed: true});
    }

    _onPressButton1(values) {
      this._setLoader(1);
      setTimeout( () => {
        console.log("Login 1sec");
         this.setTimePassed();
         this._onPressButton(values);
      },1000);
    }

  _onPressButton(values) {
    let emailError = passError = false;
    if( this.state.itemSelected == 2 ) {
      if(this.state.email != '' && this.state.email != 'undefined' && this.state.email.length > 0) {
        let isValid = emailValidate.test(this.state.email);
        if(!isValid) {
          this.setState({ hasEmailError: true });
        } else {
          if(this.state.itemSelected == 2 ) {
              //this.setState({ isSignUp: true  })
              this._setLoader(0);
              this.props.navigation.navigate('SignUp_1', {
                data: {
                  emailValue: this.state.email
                }
              });
          }
          this.setState({ hasEmailError: false });
        }
      } else {
        this.setState({ hasEmailError: true });
      }
      this._setLoader(0);
    } 
    
    if(this.state.itemSelected == 1) {
      if(this.state.email != '' && this.state.email != 'undefined' && this.state.email.length > 0) {
        if (phoneBasicValidate.test(this.state.email)) {
          this.setState({ hasEmailError: false });
        }else {
          if(emailValidate.test(this.state.email)) {
            this.setState({ hasEmailError: false });
          }else {
            this.setState({ hasEmailError: true });
          }
        }
      }else {
        this.setState({ hasEmailError: true });
      }

      if(this.state.pass.trim() != '' && this.state.pass.length > 0 && this.state.pass != 'undefined') {
        if(this.state.pass.length >= 5) {
          passError = false
        } else {
          passError = true
        }
      } else {
        passError = true
      }
      this.setState({ 
          hasPassError : passError 
        }, 
        () => this._login(),
      )
    }



  }

  _login() {
    if(!this.state.hasPassError && !this.state.hasEmailError && this.state.email != '' && this.state.pass != '') { 
      this.setState({ onLoading : true })
      fetch(HOSTNAME, {
      method: 'POST',
      headers: new Headers({
                 'Accept' : 'application/json',
                 'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        }),
      body: "key="+this.state.email+"&pwd="+this.state.pass // <-- Post parameters
      })
      .then((response) => response.json())
      .then((responseText) => {
        
        if(responseText.status == 0) {
          this._setLoader(0);
          this.setState({ hasAuthError: true });
        } 
        if(responseText.status == 1) {
          this._setLoader(1);
          this.setState({ hasAuthError: false });
          console.log('login_data', responseText.data);
          this._setAuthAsyc(responseText.data)
        }
      })
      .catch((error) => {
          console.error(error);
          //this.setState({ onLoad: false })
      });
    }else {
      this._setLoader(0);
    }
  }

  _setAuthAsyc = async (response) => {
    AsyncStorage.clear()
      try {
        await AsyncStorage.setItem("authUser", JSON.stringify(response))
         .then( ()=>{
            console.log('It was saved successfully')
            this.setState({ hasLoggedIn: true, onLoading: false });
            console.log('nav man',  this.props.navigation)
            this._setLoader(0);
            this.props.navigation.navigate('HomeLanding');
            /*this.props.navigation.dispatch(NavigationActions.reset({
                      index: 0,
                      key: null,
                      actions: [NavigationActions.navigate({ routeName: 'ProfileLanding' })]
                  }))*/
         } )
         .catch( ()=>{
            console.log("There was an error saving the product")
         } )
      } catch (error) {
        // Error saving data
        console.log('error msg');
      }
    };

  _onBackPress(data) {
    this.setState({ isSignUp: false, email: data })
  }

   _goBack() {
      this.setState({ forgotPassword: false  })
    }

  _onForgotPassword() {
      this.refs.navigationHelper._navigate('ForgotPassword', {
        data: {'fromProfile': false},
        onPressBack: this._goBack
      })
      //this.setState({ forgotPassword: true })
    }

    _backToHome() {
      let navigation = this.props.navigation;
      navigation.goBack();
    }

  render() {
    /*if(this.state.forgotPassword) {
      return (<ForgotPassword fromProfile = {false} onPressBack={this._goBack}/>);
    }*/

    if(this.state.isSignUp) {
      //return (<SignUp emailValue={this.state.email} onBackPress={this._onBackPress}/>)
    }
    if(this.state.hasLoggedIn) {
       //return (<AppNav />); 
    }
  		return (
        <KeyboardAwareScrollView style={{ paddingBottom: 50 }} keyboardShouldPersistTaps={'handled'}>
          {this.state.asycCheck == 1 && (
            <Loading opacity={0.5} />
          )}
          <NavigationHelper
                 ref={'navigationHelper'}
                 navigation={this.props.navigation}
               />
          <View>
            <TouchableOpacity onPress={this._backToHome} style={{ paddingLeft: 10,paddingTop: 15, display:'flex', flexDirection: 'row', alignItems: 'center'  }}>
              <Image
                    style={{ width: 20, height: 20 }}
                    source={backIcon}
                />
                <Text allowFontScaling={false} style={{ fontSize: width * 0.045, marginTop: 2, fontFamily: 'Poppins-Regular', color: '#007AFF' }}>Back</Text>
            </TouchableOpacity>
          </View>
          
            <View style={styles.testContainer}>
              <Text allowFontScaling={false} style={styles.login}>{this.state.itemSelected == 1? 'Login':'Sign Up'}</Text>
              <Text allowFontScaling={false} style={styles.welcomeTest}>{this.state.itemSelected == 1? 'How are you doing? Welcome back.':'Let’s get started!'}</Text>
            </View>
            <View style={styles.containerCustom}>
                <SocialLogin navigation={this.props.navigation} setLoader={this._setLoader}/>
            </View>
            <View style={styles.orSection}>
                 <View style={styles.orBorder}></View>
                 <View style={styles.orContainer}><Text allowFontScaling={false} style={styles.orText}>or</Text></View>
                 <View style={styles.orBorder}></View>
            </View>
                <View style={styles.containerCustom}>      
                     <TextInput
                        allowFontScaling={false}
                        value={this.state.email}
                        autoCapitalize = 'none'
                        type={'email'}
                        style={styles.inputCustom}
                        placeholder={this.state.itemSelected == 1?'Email or Phone' : 'Email'}
                        keyboardType={'email-address'}
                        underlineColorAndroid="transparent"
                        onChangeText={(email) => this.setState({email: email.trim()})}
                     />
                    {this.state.hasEmailError &&  (
                      <Text allowFontScaling={false} style={{ fontFamily:'Poppins-Regular', color:'red', fontSize: 12, alignSelf: 'flex-start' }}>{this.state.itemSelected == 1? 'Invalid Email or Phone Number':'Invalid Email'}</Text>
                    )}
                    {this.state.itemSelected == 1 && (
                      <TextInput
                        allowFontScaling={false}
                        style={styles.inputCustom}
                         placeholder='Password'
                         autoCapitalize = 'none'
                         secureTextEntry={true}
                         underlineColorAndroid="transparent"
                         onChangeText={(pass) => this.setState({pass: pass})}
                     />
                    )}
                    {this.state.hasPassError &&  (
                      <Text allowFontScaling={false} style={{ fontFamily:'Poppins-Regular', color:'red', fontSize: width * 0.03, alignSelf: 'flex-start' }}>Invalid Password</Text>
                    )}
                    {this.state.hasAuthError && (
                      <View style={{ backgroundColor: '#ffb2b2', borderWidth: 1, borderColor: '#ACACAC', borderRadius: 3, width: '100%', paddingBottom: 10, paddingTop: 10, marginBottom: 20, paddingLeft: 10 }}>
                          <View style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
                            <Text allowFontScaling={false} style={{ fontSize: width * 0.03, fontFamily: 'Poppins-Regular', marginLeft: 5 }}>Invalid Credentials!.</Text>
                          </View>
                    </View>  
                  )}

                  <View>
                    <TouchableOpacity  onPress={()=> this._onForgotPassword()} disabled={this.state.itemSelected == 1?false:true}>
                      <Text allowFontScaling={false} style={{ fontSize: width * 0.04, marginTop:5, marginBottom: 5, fontFamily: 'Poppins-Regular', color:'#488BF8' }}>{this.state.itemSelected == 1? 'Forgot password?':''}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.buttonContain}>
                     <TouchableOpacity style={styles.fbButtonLast} onPress={this._onPressButton1}>
                       <Text allowFontScaling={false} style={styles.btnText}>{this.state.itemSelected == 1? 'Login':'Sign Up'}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ paddingBottom: 20 }}/>
              </View>
        </KeyboardAwareScrollView>
      );
  	}

}