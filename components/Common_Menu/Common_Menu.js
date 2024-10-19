import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    TextInput,
    Text,
    View,
    Image,
    TouchableHighlight,
    Alert,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Modal
} from 'react-native'
import firebase from 'react-native-firebase';
//import { LoginManager } from 'react-native-fbsdk'
import StatusBarBackground from '../../components/Common_iOSStatusBar/Common_iOSStatusBar'
import Common_MenuList from '../../components/Common_MenuList/Common_MenuList'
import Common_IconMenu from '../Common_IconMenu/Common_IconMenu'
import dataMenu from '../../assets/json/menu.json'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import AsyncHelper from '../../components/Common_AsyncHelper/Common_AsyncHelper.js'

var MainMenuItem = dataMenu.MenuItem

class Common_Menu extends Component {
    navigation = {}
    tabRoutes = ""
    isTab = false
    isLogin = false
    constructor(props) {
      super(props);
      this.state = {
        modalVisible: false
      }
      this.iconClose = require('../../assets/icons/Close.png');
      this._toggleMenu = this._toggleMenu.bind(this)
      this._onPressItem = this._onPressItem.bind(this)
      this.navigation = props.navigation

      //TODO: integrate bookmark in related listing and nearby listing
    }

    shouldComponentUpdate(nextState,nextProps){
        return(JSON.stringify(nextState)!==JSON.stringify(this.state))
    }
    componentDidMount(){
      
    }
    componentDidUpdate(){
      this.refs.asyncHelper._getData("USER_ID",(data)=>{
      })
    }
    _init(){
        //init iconClose
        if (this.props.iconClose && this.props.iconClose != this.iconClose) {
            this.iconClose = this.props.iconClose
        }
        //init data
        if (this.props.data && this.props.data != this.data){
            this.data = this.props.data
        }
        if (this.props.navigation!=undefined && this.props.navigation != this.navigation){
            this.navigation = this.props.navigation
        }
    }

    _toggleMenu(){
      this._checkLogin(()=>{
        this.setState({
           modalVisible: this.state.modalVisible ? false : true,
        });
      });
    }

    _onPressItem(item, screen, params){
      if(screen != undefined){
          if(item == 'News'|| item =='In Depth' || item == 'SG Living' || item == 'Deal Watch' || item == 'International' || item == 'Special Features'){
              firebase.analytics().logEvent('View_Article_Category', { Category: item });
          }
        this._toggleMenu();
        //check if next screen is same as current screen
        let menuTitle = item;
        if(item == 'New Launches'){
          menuTitle = 'searchoption';
        }
        this.refs.navigationHelper._navigateInMenu(screen, {
          title: menuTitle,
          data: params
        })

        /*this.refs.navigationHelper._navigate('ListingResult', {
                title: title,
                data: data
            })*/
      }
      else if(item == "Logout"){
        Alert.alert(
          "Confirm Logout", "Are you sure you want to Logout?",
          [
            {text: 'Yes', onPress: () => {
              this.refs.asyncHelper._removeData("USER_ID");
              this.refs.asyncHelper._removeData("PROTOOLS");
              // special condition, to check LOGIN_METHOD
              // do LoginManager.logOut(); , only if LOGIN_METHOD==='fb'
             
              // remove LOGIN_METHOD field after logout was done
              this.refs.asyncHelper._removeData("LOGIN_METHOD");
              this.refs.asyncHelper._removeData("BOOKMARKS",
                () => {
                  Alert.alert(
                    "Logout success", `You have successfully logged out`,
                    [
                      {text: 'OK', onPress: () => {
                        this._toggleMenu();
                      }, style: 'default'},
                    ],
                    { cancelable: false }
                  );
                }
              )
            }},
            {text: 'No', onPress: () => {}},
          ]
        )
      }
      else if(item == "Login"){
          this._toggleMenu();
          
      }
      else{
        Alert.alert("Coming Soon...", `${item} touched, this feature will be coming soon`)
      }
    }

    componentDidMount(){
      this._checkLogin();
    }

    _checkLogin(funct){
      this.refs.asyncHelper._getData("USER_ID", (value)=>{
        /*var newUserID = value
        if(newUserID != undefined && newUserID.length > 0){
          this.userId = newUserID
          this.isLogin = true
          if(MainMenuItem[0].title == "Login"){
            MainMenuItem.splice(0, 1)
          }
          if(MainMenuItem[MainMenuItem.length-1].title != "Logout"){
            MainMenuItem.push({
              title: "Logout",
              "accordion": false,
              "MenuItem": [],
            })
          }
        }
        else{
          this.isLogin = false
          if(MainMenuItem[MainMenuItem.length-1].title == "Logout"){
            MainMenuItem.pop()
          }
          if(MainMenuItem[0].title != "Login"){
            MainMenuItem.splice(0, 0, {
              title: "Login",
              "accordion": false,
              "MenuItem": [],
            })
          }
      }*/

      })
      if(funct!=undefined){
          funct();
      }
    }

    render() {
        this._init()
        return(
            <View style={{display:'flex',position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}>
            <NavigationHelper
              ref={"navigationHelper"}
              navigation={this.props.navigation}
            />
            <AsyncHelper ref={"asyncHelper"}/>
            <Modal animationType = {"fade"} transparent = {false}
                   visible = {this.state.modalVisible}
                   onRequestClose = {() => {
                    console.log("Modal has been closed.")
                    this.setState({
                      modalVisible: false
                    })
                   } }>
                   <View style={{display:'flex',position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}>

                       <StatusBarBackground lightContent={true} style={{backgroundColor:'#275075'}}/>
                       <View style={{
                           alignItems:'flex-end',
                           paddingRight: 15,
                           paddingTop:20
                       }}>
                           <Common_IconMenu
                               imageSource={this.iconClose}
                               type={'icon'}
                               imageHeight={30}
                               imageWidth={30}
                               onPress = {this._toggleMenu}
                           />
                       </View>
                       <ScrollView>
                        <Common_MenuList
                          data={{MenuItem: MainMenuItem}}
                          onPressItem={this._onPressItem}
                        />
                       </ScrollView>
                   </View>
                </Modal>
            </View>
        )
    }
}
export default Common_Menu
