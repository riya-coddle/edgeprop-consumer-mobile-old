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
  TouchableOpacity,
  TextInput
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { HeaderBackButton } from 'react-navigation';
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import Loading from '../../components/Common_Loading/Common_Loading'
import styles from './ForgotPasswordStyle'
import Authentication from '../Authentication/Authentication.js'
import PasswordUpdate from '../../app/PasswordUpdate/PasswordUpdate.js'

var welcome = require('../../assets/images/welcome.jpg');
var backIcon = require('../../assets/icons/left-arrow.png');
const HOSTNAME = 'https://alice.edgeprop.my/api/user/v1/pwd-forgot';
var emailValidate = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default class ForgotPassword extends Component {

  constructor(props) {//console.log('prp', props);
      super(props);
      this.state = {
          timePassed: false,
          getStarted: false,
          email: '',
          toLogin: false,
          emailError: '',
          emailErrorFlag: true,
          toProfile: false,
        };
     this._onPressButton = this._onPressButton.bind(this)
     this._toLogin = this._toLogin.bind(this)
     this._handleReset = this._handleReset.bind(this)
     this.handleEmail = this.handleEmail.bind(this)
    }
    _onPressButton(back) {
      if (back) {
       this.setState({ toLogin: true })
      } else {
        this.setState({ toProfile: true })
      }
    }

    _toLogin() {
      this.setState({ toLogin: true })
    }

    handleEmail(value){
      this.setState({ email: value });    
    }
    _handleReset() {
      let isValid = emailValidate.test(this.state.email);
      if(this.state.email.length > 0 && isValid) { 
        fetch(HOSTNAME, {
        method: 'POST',
        headers: new Headers({
                   'Accept' : 'application/json',
                   'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
          }),
        body: "email="+this.state.email // <-- Post parameters
        })
        .then((response) => response.json())
        .then((responseText) => {

          if(responseText.status[0] !== undefined &&  responseText.status[0] == 0) {
            this.setState({ emailError: responseText.email[0] });
            console.log('test');
          } 
          if(responseText.status == 1) {
            this.setState({ emailError: responseText.msg, emailErrorFlag: false });
          }
          if(responseText.status == 0) {
            this.setState({ emailError: responseText.msg, emailErrorFlag: true });
          }
        })
        .catch((error) => {
            console.error(error);
        });
      } else {
        this.setState({ emailError: 'Please enter valid email id', emailErrorFlag: true });
      }
    }
    render() {
      /*if (this.state.toLogin) {
        return(<Authentication itemSelected = {1} />);
      }*/

      return (
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}>
          {!this.props.navigation.state.params.data.fromProfile && (
          <View>
           <NavigationHelper
                    ref={"navigationHelper"}
                    navigation={this.props.navigation} />

            <TouchableOpacity onPress={()=> this.props.navigation.goBack()} style={{ paddingLeft: 10,paddingTop: 15, display:'flex', flexDirection: 'row', alignItems: 'center'  }}>
              <Image
                    style={{ width: 20, height: 20 }}
                    source={backIcon}
                />
                <Text allowFontScaling={false} style={{ fontSize: 18, marginTop: 2, fontFamily: 'Poppins-Regular', color: '#007AFF' }}>Back</Text>
            </TouchableOpacity>
          </View>) }
          
          {(this.props.navigation.state.params.data.fromProfile !== undefined && this.props.navigation.state.params.data.fromProfile == true) && (<View>
              <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
                  <Image
                        style={{ width: 23, height: 23, marginLeft: 15, marginTop: 15}}
                        source={require('../../assets/icons/arrow-left.png')}
                   />
               </TouchableOpacity>  
           </View>)}

           <View style={styles.ForgotPasswordContainer}>
            <Text allowFontScaling={false} style={styles.fpText}>Forgot password?</Text>
            <Text allowFontScaling={false} style={styles.fpSubText}>Don't worry, please enter your registered email address here!</Text>
             <View>
               <TextInput
                allowFontScaling={false}
                ref={"email"}
                id={"email"}
                 style={styles.inputCustom}
                 underlineColorAndroid = "transparent"
                 placeholder = "Email"
                 placeholderTextColor = "rgb(128, 128, 128)"
                 autoCapitalize = "none"
                 onChangeText = {this.handleEmail}
                />
            </View>
             <View style={styles.buttonContainer}>
                <TouchableOpacity onPress = {()=>this._handleReset()}> 
                    <View style={styles.buttonOne}>
                        <Text allowFontScaling={false} style={styles.buttonText}>
                          RESET PASSWORD
                        </Text>
                    </View>
                </TouchableOpacity> 
            </View>

         </View>
         <View style={{paddingLeft: 23, paddingRight: 23}}>
         {this.state.emailError != '' && (
              <View style={{ backgroundColor: this.state.emailErrorFlag ? '#ffb2b2' : '#90ee90', borderWidth: 1, borderColor: '#ACACAC', borderRadius: 3, width: '100%', paddingBottom: 10, paddingTop: 10, marginBottom: 20, paddingLeft: 10 }}>
                  <View style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
                    <Text allowFontScaling={false} style={{ fontSize: 13, fontFamily: 'Poppins-Regular', marginLeft: 5 }}>{this.state.emailError}</Text>
                  </View>
            </View>  
          )}
          </View>
        </KeyboardAwareScrollView>
        );
      }
}