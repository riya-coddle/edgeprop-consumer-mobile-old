import React, { Component } from 'react'
import {View, Alert} from 'react-native'

const HOSTNAME = "https://www.edgeprop.sg";
const PROXY_URL = "/proxy?url=";
const API_DOMAIN = "https://api.theedgeproperty.com.sg";
const API_GET_BOOK_MARK = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN + "/bookmarks/show?")
const UPDATE_BOOK_MARK = "/bookmarks/update"
const TIMEOUT = 1000;
import AsyncHelper from '../../components/Common_AsyncHelper/Common_AsyncHelper.js'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
export default class BookmarkHelper extends Component{
    constructor(props){
        super(props);
        this._checkLogin = this._checkLogin.bind(this)
        this._getBookmarks = this._getBookmarks.bind(this)
        this._callGetBookmarks = this._callGetBookmarks.bind(this)
        this._callUpdateBookmarks = this._callUpdateBookmarks.bind(this)
        this._updateBookmark = this._updateBookmark.bind(this)
    }

    _checkLogin(functLogin, functNoLogin){
      this.refs.asyncHelper._getData("USER_ID", (value)=>{
        var userId = value
        if(userId!= undefined && userId.length > 0){
          if(functLogin!=undefined){
            functLogin(userId);
          }
        }
        else{
          if(functNoLogin!=undefined){
            functNoLogin();
          }
        }
      })
    }

    _getBookmarks(funct){
      this.refs.asyncHelper._getData("BOOKMARKS", (value)=>{
        var nids = JSON.parse(value)
        // Alert.alert("bookmarks",nids);
        funct(nids)
      })
    }

    _callGetBookmarks(uid, onSuccess, onError){
      if(uid!=undefined && uid.length>0){
        
        // fetch(API_GET_BOOK_MARK+encodeURIComponent("u="+uid+"&source=web"+"&version=2.2.2"),
        fetch(("https://api.theedgeproperty.com.sg/bookmarks/show?source=web&u="+uid+"&version=2.2.2"),
        {
            method: 'GET', timeout: TIMEOUT
        }).
        then((response) => response.json()).
        then((responseJson) => {
            if (responseJson && responseJson.results && responseJson.results.nid) {
              this.refs.asyncHelper._setData("BOOKMARKS", JSON.stringify(responseJson.results.nid), onSuccess)
            }
        })
        .catch((error) => {
            console.log(error);
        });
      }
    }

    _callUpdateBookmarks(uid, nid, action, onSuccess, onError){
      if(uid!=undefined && uid.length>0){
        let param = "url="+ encodeURIComponent(API_DOMAIN+UPDATE_BOOK_MARK) + "&uid=" + uid + "&bmid=" + nid + "&type=" + action;
        fetch(HOSTNAME+'/proxy', {
          method: 'POST',
          headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'}),
          body: param
        }).
        then((response) => response.json()).
        then((responseJson) => {
            if (responseJson && responseJson.results) {
              this.refs.asyncHelper._setData("BOOKMARKS", JSON.stringify(responseJson.results), onSuccess)
            }
        })
        .catch((error) => {
            if(onError){
              onError(error);
            }
        });
      }
    }

    _updateBookmark(nid, flag, onSuccess){
      this._checkLogin(
        (uid)=>{
          var action = flag? "add" : "delete"
          this._callUpdateBookmarks(uid, nid, action, onSuccess)
        },
        ()=>{
          Alert.alert(
            "Login Required",
            "Bookmark feature requires login, do you want to login?",
            [
              {text: 'Yes', onPress: () => {
                this.refs.navigationHelper._navigate('RegWall', {
                  data: {
                  }
                })
              }, style: 'default'},
              {text: 'No', onPress: () => {}, style: 'destructive'}, //default //cancel //destructive
            ],
            { cancelable: false }
          )
        }
      )
    }

    componentDidMount(){
    }

    render(){
        return(
          <View>
            <AsyncHelper ref={"asyncHelper"}/>
            <NavigationHelper
              navigation={this.props.navigation}
              ref={"navigationHelper"}/>
          </View>
        )
    }
}
