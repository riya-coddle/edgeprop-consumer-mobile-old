import React, { Component } from 'react'
import {
  View,
  Image,
  Text,
  Alert,
  Platform
} from 'react-native'
/*import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import Button from '../../components/Common_Button/Common_Button.js'
import IconMenu from '../../components/Common_IconMenu/Common_IconMenu.js'
import StatusBarBackground from '../../components/Common_iOSStatusBar/Common_iOSStatusBar'
import Loading from '../../components/Common_Loading/Common_Loading'
// const FBSDK = require('react-native-fbsdk');
// const {
//   LoginButton,
//   AccessToken
// } = FBSDK;
import { LoginManager, AccessToken } from 'react-native-fbsdk'
import BookmarkHelper from '../../components/Common_BookmarkHelper/Common_BookmarkHelper.js'
import AsyncHelper from '../../components/Common_AsyncHelper/Common_AsyncHelper.js'

const HOSTNAME = "https://www.edgeprop.sg";
const PROXY_URL = "/proxy?url=";
const API_DOMAIN = "https://api.theedgeproperty.com.sg";

*/export default class RegWall extends Component {
 /* navigation = {}
  params = {}
  closeIcon = require('../../assets/icons/close_gray_white.png');
  static navigationOptions = {
      header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }

    this.navigation = props.navigation
    this._login = this._login.bind(this)
    this._signUp = this._signUp.bind(this)
    this._fbLogin = this._fbLogin.bind(this);
    this._handleGoBack = this._handleGoBack.bind(this)
  }

  _handleGoBack(){
    if(this.props.navigation.state.params._handleBack)
      this.props.navigation.state.params._handleBack();
    this.props.navigation.goBack()
  }

  _login(){
    var data = {}
    if(this.props.navigation.state.params != undefined && this.props.navigation.state.params.data.handleLogin != undefined){
      data.handleLogin = this.props.navigation.state.params.data.handleLogin
    }
    if(this.props.navigation.goBack != undefined){
      if(this.props.navigation.state.params._handleBack){
           data.handleGoBack = this._handleGoBack
      }
      else{
          data.handleGoBack = this.props.navigation.goBack
      }
    }
    this.refs.navigationHelper._navigate('Login', {
      data: data
    })
  }

  _signUp(){
    var data = {}
    if(this._login != undefined){
      data.navigateToLogin = this._login
    }
    this.refs.navigationHelper._navigate('SignUp_1', {
      data: data
    })
  }

  _handleValidLogin(uid){
    this.refs.asyncHelper._setData("USER_ID", uid.toString());
    this.refs.asyncHelper._setData("LOGIN_METHOD", 'fb');
    this.refs.bookmarkHelper._callGetBookmarks(uid.toString(), ()=>{
      Alert.alert(
        "Login Success",
        "You have successfully logged in", //, Profile Screen will be coming soon",
        [
          {text: 'OK', onPress: () => {
            this._handleGoBack()
          }, style: 'default'}, //default //cancel //destructive
        ],
        { cancelable: false }
      ),
      ()=>{
        this._handleInvalidLogin();
      }
    })
  }

  _handleInvalidLogin(message){
    if(message==undefined){
      message = "Sorry, something went wrong."
    }
    Alert.alert(
      "Error",
      message,
      [
        {text: 'Dismiss', onPress: () => {}, style: 'destructive'}, //default //cancel //destructive
      ],
      { cancelable: false }
    )
  }

  _handleFbLogin(token, userId){
    // trigger render to show loading indicator
    this.setState({
      isLoading: true
    })
    //https://api.theedgeproperty.com.sg/fblogin?token=xxx&uid=xxx
    let param = encodeURIComponent(API_DOMAIN + "/fblogin?" + "token=" + token + "&uid=" + userId);
    let url = HOSTNAME + PROXY_URL + param
    fetch(url,
    {
      method: 'GET',
      headers: new Headers({'Content-Type': 'application/json'})
    })
    .then((response) => response.json())
    .then((responseJson) => {
      var uid = responseJson.uid
      if(!uid){
        this._handleInvalidLogin("Invalid username or password");
      }
      else if(uid>0){
        this._handleValidLogin(uid);
      // trigger render to hide loading indicator
      _this.setState({
        isLoading: false
      })}
    })
    .catch((error) => {
      console.log(error);
      this._handleInvalidLogin("Invalid username or password");
      // trigger render to hide loading indicator
      _this.setState({
        isLoading: false
      })
    });
  }

  _fbLogin(){
    _this = this
    if(Platform.OS === 'ios'){
      LoginManager.setLoginBehavior('web');
    }
    LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
     function (result) {
       var token, userID;
       if (result.isCancelled) {
         console.log('Login cancelled')
       } else {
         AccessToken.getCurrentAccessToken().then(
          (data) => {
            token = data.accessToken.toString();
            userID = data.userID.toString();
            //login to edgeprop server
            _this._handleFbLogin(token, userID)
          }
        )

        console.log('Login success with permissions: ' + result.grantedPermissions.toString())
       }
     },
     function (error) {
       console.log('Login fail with error: ' + error)
     }
   )
  }

  render() {
    if (this.state.isLoading){
      return (
        <View style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          display: this.state.isLoading ? 'flex' : 'none',
          backgroundColor: 'rgb(0,0,0)'
        }}>
          <BookmarkHelper
            ref={"bookmarkHelper"}
            navigation = {this.props.navigation}
          />
          <AsyncHelper ref={"asyncHelper"}/>
          <Loading />
        </View>
      )
    }

    return (
      <View style={{
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <BookmarkHelper
          ref={"bookmarkHelper"}
          navigation = {this.props.navigation}
        />
        <AsyncHelper ref={"asyncHelper"}/>
        <StatusBarBackground lightContent={true} style={{ backgroundColor: '#275075' }} />
        <NavigationHelper
          ref={"navigationHelper"}
          navigation={this.props.navigation}
        />
        <View style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Image
            source={require('../../assets/icons/reg-wall.png')}
            style={{width: 322, height: 211}}
          />
          <Text allowFontScaling={false} style={{
            fontFamily: "Poppins-Regular",
            fontSize: 30,
            letterSpacing: 0.4,
            color: "#275075",
          }}>
            Login Required
          </Text>
          <Text allowFontScaling={false} style={{
            fontFamily: "Poppins-Light",
            fontSize: 16,
            lineHeight: 20,
            color: "#275075",
          }}>
            Please login to proceed.
          </Text>
          {/* Please signup or login to proceed. 
        </View>
        <View style={{
          width: "100%",
          height: 188,
          // alignItems: "center",
          // justifyContent: "center",
          backgroundColor: "#f1f4f7",
          paddingHorizontal: 14,
          paddingTop: 8
        }}>
        <View
          style={{
            marginVertical: 9,
            flexDirection: 'row'
          }}>
          <View style={{
              width: '50%',
              paddingRight: 5
            }}>
            <Button
              textValue={"Login"}
              textSize={15}
              fontFamily={"Poppins-Medium"}
              borderRadius={5}
              borderWidth = {1}
              height={50}
              backgroundColor={"#ffffff"}
              borderColor={"#275075"}
              textColor={"#275075"}
              onPress = {()=>this._login()}
            />
          </View>
          <View style={{
              width: '50%',
              paddingLeft: 5
            }}>
            <Button
              textValue={"Sign Up"}
              textSize={15}
              fontFamily={"Poppins-Medium"}
              borderRadius={5}
              borderWidth = {1}
              height={50}
              backgroundColor={"#ffffff"}
              borderColor={"#275075"}
              textColor={"#275075"}
              onPress = {()=>this._signUp()}
            />
          </View>
        </View>

          <Button
            iconUrl={require("../../assets/icons/facebook.png")}
            textValue={"Connect with Facebook"}
            textSize={15}
            fontFamily={"Poppins-Medium"}
            borderRadius={5}
            borderWidth = {1}
            height={50}
            backgroundColor={"#34589d"}
            borderColor={"#34589d"}
            textColor={"#fff"}
            onPress = {()=>this._fbLogin()}
          />
        <Button
            // marginHorizontal={14}
            textValue={"SMS"}
            textSize={15}
            fontFamily={"Poppins-Medium"}
            borderWidth = {0}
            borderRadius={5}
            height={50}
            backgroundColor={"#34589d"}
            onPress = {()=>{}}>
            <IconMenu
                type={'icon-text'}
                textPosition={'right'}
                imageSource={require('../../assets/icons/facebook.png')}
                imageHeight={25}
                imageWidth={25}
                textValue={"Connect With Facebook"}
                textSize={15}
                fontFamily={'Poppins-Medium'}
                textColor={'#ffffff'}
                gapAround={{
                    marginTop: 0,
                    marginBottom: 0,
                    marginRight: 3,
                    marginLeft: 3,
                }}
            />
          </Button> 
        </View>
        <View style={{
          position:"absolute",
          right: 0,
          top: 0,
          width: 26,
          height: 26,
          marginTop: 15,
          marginRight: 15
        }}>
          <IconMenu
              imageWidth={26}
              imageHeight={26}
              // padding={10}
              type={"icon"}
              imageSource={this.closeIcon}
              onPress={()=>{
                if(this.props.navigation.goBack!=undefined){
                    if(this.props.navigation.state.params._handleClose){
                        // this.props.navigation.state.params._handleClose('HomeLanding')
                        // this.props.navigation.goBack();
                        this.refs.navigationHelper._navigate('HomeLanding', {
                          data: {}
                        })
                    }else{
                        this.props.navigation.goBack();
                    }


                }
              }}
          />
        </View>
      </View>
    )
  }*/
}
