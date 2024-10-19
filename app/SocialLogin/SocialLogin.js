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
  AsyncStorage
} from 'react-native';
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import Loading from '../../components/Common_Loading/Common_Loading'
import { LoginButton, AccessToken, LoginManager , GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin';

//import AppNav from '../../app/AppNav.js'
import styles from './SocialLoginStyle.js'

const HOSTNAME = "https://alice.edgeprop.my/api/user/v1/register";

export default class SocialLogin extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
          onSuccess: false,
          onLoading : false
      };
     this._onPressFacebook = this._onPressFacebook.bind(this)
     this.socialLogin  = this.socialLogin.bind(this)
     this._setAuthAsyc = this._setAuthAsyc.bind(this)
     this._oncomingSoon = this._oncomingSoon.bind(this);
     this._onPressGoogle = this._onPressGoogle.bind(this);

     GoogleSignin.configure({
        //It is mandatory to call this method before attempting to call signIn()
        //scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        // Repleace with your webClientId generated from Firebase console
        webClientId: '22990985339-iq3fj9u7d2j0bhbpnaqev7l5546tlhra.apps.googleusercontent.com',
        offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        hostedDomain: '',
      }); 
  	}
    _oncomingSoon() {
      Alert.alert('Coming soon!!')
    }
    _setAuthAsyc = async (response) => {
      try {
        await AsyncStorage.setItem("authUser", JSON.stringify(response))
         .then( ()=>{
            //console.log('It was saved successfully')
            this.setState({ onLoading : false})
            this.props.navigation.navigate('HomeLanding');
            //console.log('It waddds saved successfully')
         } )
         .catch( (error)=>{console.log('errorgh',error);
            console.log("There was an error saving the product")
         } )
      } catch (error) {
        // Error saving data
        console.log('error msg');
      }
    };

    socialLogin(data,type) {
      if ((data.name == '' || data.name == undefined) || (data.email == '' || data.email == undefined)) {
          this.props.setLoader(2);
          Alert.alert('Could not find required information! Please Signup');
          this.props.navigation.navigate('Authentication', {
          data: {
            itemSelected: 2
          }
        });
      } 
      else if (data.name != '' && data.email != '' && data.email != undefined) {
        fetch(HOSTNAME, {
          method: 'POST',
          headers: new Headers({
                     'Accept' : 'application/json',
                     'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
            }),
          body: "name="+data.name+"&email="+data.email+"&reg_from="+type+"&login=1" // <-- Post parameters
          })
          .then((response) => response.json())
          .then((responseText) => {
            console.log(responseText)
            this._setAuthAsyc(responseText.data);
            this.props.setLoader(1);
          })
          .catch((error) => {
            this.props.setLoader(2);
              console.error(error);
          });
        }
      else{
          this.props.setLoader(2);
        } 
      }
    

    _onPressFacebook() {
      AccessToken.getCurrentAccessToken().then(
            (data) => {
              if(data != null) {
                LoginManager.logOut(); 
              }
            } //Refresh it every time
        );
        
        LoginManager.logInWithPermissions(['public_profile', 'email'])
        .then((result) => {console.log(result);
            if (result.isCancelled) {
              console.log('Login cancelled')
            } 
            else {
              this.props.setLoader(0);
              AccessToken.getCurrentAccessToken().then((data) => {
                const { accessToken } = data
                console.log('data fb',data)
                var api = 'https://graph.facebook.com/v2.8/' + data.userID +
             '?fields=name,email&access_token=' + data.accessToken;
                  fetch(api)
                    .then((response) => response.json())
                    .then( (responseData) => {
                        if(responseData.name != '' && responseData.email != '') { 
                         this.props.setLoader(0);
                         this.setState(() => this.socialLogin(responseData, 1))  
                        }
                    })
                    .done(); 
              })
            }
        }).
        catch ((error) => {

          console.log('Login fail with error: ' + error)
        })
    }

    _onPressGoogle = async () => {
      
      //Prompts a modal to let the user sign in into your application.
      try {
        await GoogleSignin.signOut();
        await GoogleSignin.hasPlayServices({
          //Check if device has Google Play Services installed.
          //Always resolves to true on iOS.
          showPlayServicesUpdateDialog: true,
        });
        const userInfo = await GoogleSignin.signIn();
        //console.log('User Info --> ', userInfo);
        if(userInfo.user != '' && userInfo.user.email != '') {
            this.props.setLoader(0);
            let userData = {
              name :userInfo.user.name, 
              email: userInfo.user.email,
            }
            this.setState(() => this.socialLogin(userData, 2))  
        }
      } catch (error) {
        this.props.setLoader(2);
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log('User Cancelled the Login Flow');
        } else if (error.code === statusCodes.IN_PROGRESS) {
          console.log('Signing In');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          console.log('Play Services Not Available or Outdated');
        } else {
          console.log('Some Other Error Happened');
        }
      }
    };


  	render() {
    	return (
          <View style={{ marginTop: 20, width: '100%' }}>
          
            <View style={styles.buttonContain}>
              <TouchableOpacity style={styles.fbButton} onPress={this._onPressFacebook}>
                <Image
                    style={{ width: 15, height: 15, marginRight: 15, marginLeft: 5 }}
                    source={require('../../assets/icons/fb-logo.png')}
                  />
                <Text allowFontScaling={false} style={styles.btnText}>Login with Facebook</Text>
             </TouchableOpacity>
            </View>
            <View style={styles.buttonContain}>
              <TouchableOpacity style={styles.secondButton} onPress={this._onPressGoogle}>
                <Image
                    style={{ width: 15, height: 15, marginRight: 15, marginLeft: 5 }}
                    source={require('../../assets/icons/google-logo.png')}
                  />
                <Text allowFontScaling={false} style={styles.btnText}>Login with Google</Text>
             </TouchableOpacity>
            </View>
          </View>
      	);
    }  
}