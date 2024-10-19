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
import { HeaderBackButton } from 'react-navigation';
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import Loading from '../../components/Common_Loading/Common_Loading'
import ForgotPassword from '../../app/ForgotPassword/ForgotPassword.js'

const HOSTNAME = 'https://alice.edgeprop.my/api/user/v1/pwd-update';

export default class PasswordUpdate extends Component {
	
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
      };
  };

  constructor(props) {
    super(props);
    this.state = {
      currentPass: '',
      newPass: '',
      confPass: '',
      currentPassError: false,
      newPassError: false,
      confPassError: false,
      newPassErrorMsg: '',
      success: false,
      hasUpdateError: false,
      toForgotPassword: false,
    };

    this._onPress = this._onPress.bind(this);
    this._updatePasswod = this._updatePasswod.bind(this);
    this._toForgotPassword = this._toForgotPassword.bind(this);
    this._goBack = this._goBack.bind(this)
  }

    _toForgotPassword() { 
      this.refs.navigationHelper._navigate('ForgotPassword', {
        data: {'fromProfile': true},
      })
      //this.setState({ toForgotPassword : true});
    }
    
    _updatePasswod() {
      if(!this.state.currentPassError && !this.state.newPassError && !this.state.confPassError) {
          let uid  = this.props.navigation.state.params.data.uid;
          let old  = this.state.currentPass;
          let conf = this.state.confPass;
          let pass = this.state.newPass;
          let key  = this.props.navigation.state.params.data.accesskey;
         
          fetch(HOSTNAME, {
            method: 'POST',
            headers: new Headers({
                     'Accept' : 'application/json',
                     'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
            }),
            body: "old_password="+old+"&new_password="+pass+"&cnf_password="+conf+"&key="+key+"&uid="+uid// <-- Post parameters        })
          }).then((response) => response.json())
          .then((responseText) => {
              if(responseText.status == 1) {
                this.setState({ success : true, hasUpdateError : false })
              }
              if(responseText.status == 0) {
                this.setState({ hasUpdateError : true, success : false })
              } 
          })
          .catch((error) => {
              console.error(error);
          });
      } 
    }

    _onPress() {

      if(this.state.newPass == '') {
        this.setState({ newPassError: true, newPassErrorMsg: 'Password must be at least 5 characters' })
      } else {
        this.setState({ newPassError: false, newPassErrorMsg: '' })
      }
      if(this.state.confPass == '') {
        this.setState({ confPassError: true })
      } else {
        if(this.state.confPass == this.state.newPass) {
          this.setState({ confPassError: false })
        } else {
          this.setState({ confPassError: true })
        }
      }

      if(this.state.currentPass != '' && this.state.currentPass.length >= 5) {
        this.setState({ currentPassError: false })
        // check if the new password is empty
        if(this.state.newPass && this.state.newPass.length >= 5) {
          this.setState({ newPassError: false , newPassErrorMsg: '' })
          // check if new password and current password are same
          if(this.state.newPass === this.state.currentPass) {
            this.setState({ newPassError : true, newPassErrorMsg: "Current and New passwords can't be same!" }) 
          } else {
            this.setState({ newPassError: false,newPassErrorMsg: '' })
            if(this.state.confPass != '' && this.state.confPass.length >= 5) {
              this.setState({ confPassError : false }) 
              // verify conf password 
              if(this.state.newPass === this.state.confPass) {
                this.setState({ confPassError : false })  
                this._updatePasswod();
              } else {
                this.setState({ confPassError : true })  
              }
            } else {
              this.setState({ confPassError : true })  
            }  
          }
          
        } else {
          this.setState({ newPassError: true, newPassErrorMsg: 'Password must be at least 5 characters' })
        }
      } else {
        this.setState({ currentPassError: true })
      }
    }

    _goBack() {
      this.setState({ toForgotPassword: false  })
    }

  	render() {
      /*if (this.state.toForgotPassword) {
        return (<ForgotPassword fromProfile = {true} onPressBack={this._goBack}/>);
      }*/
    	return (
          <ScrollView>
        	    <NavigationHelper
                 ref={'navigationHelper'}
                 navigation={this.props.navigation}
               />  
               <View style={{ padding: 23, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <TouchableOpacity onPress={() => (this.props.navigation.goBack() && this.props.navigation.state.params.onGoBack())}>
                    <Image
                        style={{ width: 23, height: 23 }}
                        source={require('../../assets/icons/arrow-left.png')}
                      />
                    </TouchableOpacity>  
                  </View>
                  <View>
                    <Text allowFontScaling={false} style={{ fontSize: 18, fontFamily: 'Poppins-Medium', color:'#414141' }}>Password</Text>
                  </View>
                  <View>
                    <TouchableOpacity onPress={this._onPress}>
                      <Text allowFontScaling={false} style={{ fontSize: 16, fontFamily: 'Poppins-Medium', color:'#606060' }}>Done</Text>
                    </TouchableOpacity>
                  </View>
              </View>
              <View style={{ paddingTop: 30, paddingLeft: 23, paddingRight: 23 }}>
                {this.state.hasUpdateError && (
                  <View style={{ backgroundColor: '#F44336', borderRadius: 3, width: '100%', paddingBottom: 15, paddingTop: 15, marginBottom: 20, paddingLeft: 10 }}>
                      <View style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
                        <Text allowFontScaling={false} style={{ fontSize: 15, fontFamily: 'Poppins-Regular', marginLeft: 5, color: '#fff' }}>Current password is invalid!</Text>
                      </View>
                  </View>  
                )}
                {this.state.success && (
                  <View style={{ backgroundColor: '#4CAF50', borderRadius: 3, width: '100%', paddingBottom: 15, paddingTop: 15, marginBottom: 20, paddingLeft: 10 }}>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text allowFontScaling={false} style={{ fontSize: 15, fontFamily: 'Poppins-Regular', marginLeft: 5, color: '#fff' }}>Updated successfully!</Text>
                        <TouchableOpacity onPress={() => this.setState({ success: false, hasUpdateError: false })} >
                          <Image
                            style={{ width: 10, height: 10, alignSelf: 'center', marginRight: 10, marginTop: 5 }}
                            source={require('../../assets/icons/close-white-2.png')}
                          />
                        </TouchableOpacity>
                      </View>
                  </View>  
                )}
                <View>
                  <Text allowFontScaling={false} style={{ fontSize: 16, fontFamily: 'Poppins-Regular', color:'#414141' }}>Current password</Text>
                    <TextInput
                        allowFontScaling={false}
                         value={this.state.currentPass}
                         style={{ fontSize: 15, fontFamily: 'Poppins-Regular', color:'#606060', marginTop:-10 }}
                         autoCapitalize = 'none'
                         secureTextEntry={true}
                         underlineColorAndroid="#F4F4F6"
                         onChangeText={(pass) => this.setState({currentPass: pass})}
                     />
                     {this.state.currentPassError &&  (
                      <Text allowFontScaling={false} style={{ fontFamily:'Poppins-Regular', color:'red', fontSize: 13, alignSelf: 'flex-start' }}>Password must be at least 5 characters</Text>
                      )}
                    <TouchableOpacity onPress={()=> this._toForgotPassword()}>
                      <Text allowFontScaling={false} style={{ fontSize: 14, fontFamily: 'Poppins-Regular', color:'#488BF8' }}>Forgot password?</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ paddingTop: 25 }}>
                  <Text allowFontScaling={false} style={{ fontSize: 16, fontFamily: 'Poppins-Regular', color:'#414141', }}>New Password</Text>
                    <TextInput
                        allowFontScaling={false}
                         value={this.state.newPass}
                         style={{ fontSize: 15, fontFamily: 'Poppins-Regular', color:'#606060', marginTop:-10 }}
                         autoCapitalize = 'none'
                         secureTextEntry={true}
                         underlineColorAndroid="#F4F4F6"
                         onChangeText={(pass) => this.setState({newPass: pass})}
                    />
                    {this.state.newPassError &&  (
                      <Text allowFontScaling={false} style={{ fontFamily:'Poppins-Regular', color:'red', fontSize: 13, alignSelf: 'flex-start' }}>{this.state.newPassErrorMsg}</Text>
                    )}
                </View>
                <View style={{ paddingTop: 25 }}>
                  <Text allowFontScaling={false} style={{ fontSize: 16, fontFamily: 'Poppins-Regular', color:'#414141', }}>Confirm Password</Text>
                    <TextInput
                        allowFontScaling={false}
                         value={this.state.confPass}
                         style={{ fontSize: 15, fontFamily: 'Poppins-Regular', color:'#606060', marginTop:-10 }}
                         autoCapitalize = 'none'
                         secureTextEntry={true}
                         underlineColorAndroid="#F4F4F6"
                         onChangeText={(pass) => this.setState({confPass: pass})}
                     />
                    {this.state.confPassError &&  (
                      <Text allowFontScaling={false} style={{ fontFamily:'Poppins-Regular', color:'red', fontSize: 13, alignSelf: 'flex-start' }}>Passwords did not match!</Text>
                    )} 
                </View>
              </View>
          </ScrollView>
      	);
      }
}