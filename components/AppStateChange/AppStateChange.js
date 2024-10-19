import React, {Component} from 'react'
import {AppState, Text, View, Alert, Platform, Linking} from 'react-native'
import VersionNumber from 'react-native-version-number';
import AsyncHelper from '../Common_AsyncHelper/Common_AsyncHelper'

const HOSTNAME = "https://www.edgeprop.sg";
const PROXY_URL = "/proxy?url=";
const API_APP_VERSION = "https://dbv47yu57n5vf.cloudfront.net/mobile/app-version/edgeprop-app-ver.json";
const API_APP_VERSION_ENCODED = HOSTNAME + PROXY_URL + encodeURIComponent(API_APP_VERSION);
const TIMEOUT = 1000;

export default class AppStateChange extends Component {

  appState
  constructor(props){
    super(props);
    this.showAlert = false
    this.callingAPI = false

    this._handleAppStateChange = this._handleAppStateChange.bind(this)
    this._callAPI = this._callAPI.bind(this)
    this._checkVersion = this._checkVersion.bind(this)
    this._goToLink = this._goToLink.bind(this)
  }

  componentDidMount() {
    this._callAPI(API_APP_VERSION);
    this.appState = 'active'
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _callAPI(apiUrl) {
    if(!this.callingAPI){
      this.callingAPI = true
      fetch(apiUrl,
      {
          method: 'GET', timeout: TIMEOUT
      }).
      then((response) => response.json()).
      then((responseJson) => {
          if (responseJson) {
            this._checkVersion(responseJson)
            this.callingAPI = false
          }
      })
      .catch((error) => {
          console.log(error);
      });
    }
  }

  _goToLink(link){
    Linking.canOpenURL(link).then(supported => {
        if (!supported) {
            console.log('Can\'t handle url: ' + link);
        } else {
            return Linking.openURL(link);
        }
    }).catch(err => console.error('An error occurred', err));
  }

  _checkVersion(newAppVersion){
    needUpdate = false
    forceUpdate = false
    link = ""
    store = ""
    newVersion = VersionNumber.appVersion
    if(Platform.OS == "android"){
      newVersion = newAppVersion.android_ver
      link = "market://details?id=my.com.theedgeproperty.app"
      store = "Google Play Store"
    }
    else if(Platform.OS == "ios"){
      newVersion = newAppVersion.ios_ver
      link = "itms-apps://itunes.apple.com/sg/app/apple-store/id1069299307?mt=8"
      store = "App Store"
    }
    //console.log('newVersion',newVersion);
    //console.log('appVersion',VersionNumber.appVersion)
    if(newVersion != VersionNumber.appVersion){
      currentSubVers = VersionNumber.appVersion.split(".")
      newSubVers = newVersion.split(".")

      currentVers = currentSubVers[0] != undefined ? currentSubVers[0] : 0 ;
      currentMajorVers = currentSubVers[1] != undefined ? currentSubVers[1] : 0 ;
      currentMinorVers = currentSubVers[2] != undefined ? currentSubVers[2] : 0 ;

      newVers = newSubVers[0] != undefined ? newSubVers[0] : 0 ;
      newMajorVers = newSubVers[1] != undefined ? newSubVers[1] : 0 ;
      newMinorVers = newSubVers[2] != undefined ? newSubVers[2] : 0 ;

      if(currentVers < newVers){
        needUpdate = true
        forceUpdate = true
      } else if(currentVers == newVers){
        if (currentMajorVers < newMajorVers) {
          needUpdate = true
          forceUpdate = true
        } else if(currentMajorVers == newMajorVers){
          if(currentMinorVers < newMinorVers){
            needUpdate = true
            forceUpdate = false
          } else {
            needUpdate = false
            forceUpdate = false
          }
        }
      }
      
    }
   
    //needUpdate = false;

    if(needUpdate && !this.showAlert){
      this.showAlert = true
      if(forceUpdate){
        Alert.alert(
          "Update Required!",
          // "This version of Edgeprop is no longer supported. Please visit the " + store + " to upgrade to the latest version.",
          "In order to serve you better, please visit the " + store + " to upgrade to the latest version.",
          [
            {text: 'Go to ' + store, onPress: () => {
              if(link.length > 0){
                this.showAlert = false
                this._goToLink(link)
              }
            }, style: 'default'},
          ],
          { cancelable: false }
        )
      }
      else{
        if(this.refs.asyncHelper != undefined){
          this.refs.asyncHelper._getData("SKIPPED_VERSION", (value)=>{
             if(value != newVersion){
               Alert.alert(
                 "Update Available!",
                 "Version " + newVersion + " of EdgeProp is available.\n\nWould you like to update?",
                 // "Update " + newVersion + " is available to download. Downloading the latest update, you will get the latest features, improvements and bug fixes of EdgeProp.",
                 [
                   {text: 'Yes', onPress: () => {
                     if(link.length > 0){
                       this.showAlert = false
                       this._goToLink(link)
                     }
                   }, style: 'default'},
                   {text: 'Maybe later', onPress: () => {
                     this.showAlert = false
                   }, style: 'default'}, //default //cancel //destructive
                   {text: 'Skip this version', onPress: () => {
                     this.showAlert = false
                     if(this.refs.asyncHelper != undefined){
                       this.refs.asyncHelper._setData("SKIPPED_VERSION", newVersion)
                     }
                   }, style: 'default'}, //default //cancel //destructive
                 ],
                 { cancelable: false }
               )
             }
          })
        }
      }
    }
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.appState.match(/inactive|background/) && nextAppState === 'active') {
      // console.log('App has come to the foreground!')
    }
    this.appState = nextAppState;
    if(this.appState == 'active'){
      this._callAPI(API_APP_VERSION)
    }
  }

  render() {
    return (
      <View>
        <AsyncHelper ref={"asyncHelper"}/>
      </View>
    );
  }

}
