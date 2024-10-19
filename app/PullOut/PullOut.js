import React, { Component } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    ScrollView,
    PixelRatio,
    Dimensions,
    Linking,
    TouchableOpacity,
    ImageBackground,
    WebView
} from 'react-native'
import Button from '../../components/Common_Button/Common_Button';
//import MyWebView from 'react-native-webview-autoheight';
import firebase from 'react-native-firebase';
import appsFlyer from 'react-native-appsflyer';
import StatusBarBackground from '../../components/Common_iOSStatusBar/Common_iOSStatusBar'
import dataMenu from '../../assets/json/menu.json'
import Common_Menu from '../../components/Common_Menu/Common_Menu.js'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import News_NewsDetail from '../../components/News_NewsDetail/News_NewsDetail.js'
import ShareHelper from '../../components/Common_ShareHelper/Common_ShareHelper.js'
import NewsActions from '../../realm/actions/NewsActions';
import ModalLanding from '../ModalLanding/ModalLanding.js';
import BookmarkModal from '../BookmarkModal/BookmarkModal.js'
import styles from './PullOutStyle';
import Loading from '../../components/Common_Loading/Common_Loading'
//import Moment from 'moment';

const HOSTNAME = "https://www.edgeprop.sg";
const PROXY_URL = "/proxy?url=";
const API_DOMAIN = "https://www.edgeprop.sg";
const API_GET_ARTICLE_DETAIL = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN + "/tep-solr/api/articles/getArticleDetails.php?");
const API_GET_RELATED_ARTICLES = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN + "/tep-solr/api/articles/getRelatedArticles.php?page=1&size=4")
const TIMEOUT = 1000;
//const API_NEWS_DETAILS = 'https://slimapi.edgeprop.my/getcontentbypath';
const API_NEWS_DETAILS = 'https://alice.edgeprop.my/api/v1/newsdetail/';
const PIXELRATIO = PixelRatio.get()
const DEVICEWIDTH = Dimensions.get('window').width
const API_RELATED_NEWS = 'https://alice.edgeprop.my/api/v1/view/relatednews/';

var bookmark = require('../../assets/icons/bookmark-notSelected.png');
var download = require('../../assets/icons/download.png');
var upload   = require('../../assets/icons/share_black.png');
var fontIcon     = require('../../assets/icons/font-icon.png');
var backIcon = require('../../assets/icons/back-arrow.png');

export default class PullOut extends Component{

    static navigationOptions = ({ navigation }) => {
      var menu_icon = require('../../assets/icons/menu.png');
      var share_icon = require('../../assets/icons/share.png');
      var { state, setParams } = navigation;
      var {params} = state
      return {
       // title: "News".toUpperCase(),
        header: null,
        /*headerTransparent: true,
        headerStyle: {
          transparentHeader: {
              position: 'absolute',
              backgroundColor: 'transparent',
              //zIndex: 100,
              
            },
        }*/
      };
    };
    didMount;
    constructor(props) {
      super(props);
      this.navigation = props.navigation
      this.params = this.navigation.state.params
      this.newsDetailContent = this.params.data.newsDetailContent // this can be undefined
      this.nid = this.params.data.nid // this can be undefined
      this.url = this.params.data.url
      //this.content = this.params.data.url.replace("https://www.edgeprop.my/", "");
      //console.log('content',this.content);
      this.alias = this.params.data.alias // this can be undefined
      this.author = null;
      //console.log('params',this.params);
      this.NewsActions = new NewsActions();

      this.state = {
        displayMenu: false,
        author: '',
        created: '',
        title: '',
        newsDetail: '',//this.NewsActions.GetNewsDetail(this.nid),
        relatedNews: {},//this.NewsActions.GetRelatedNews(this.nid),
        isModal: false,
        bookmark: false,
        loaded: false,
        // isFocused: true
      }
      
      /*this.navigation.setParams({
        toggleMenu: this._toggleMenu,
        shareNews: this._shareNews
      })*/
    }

    componentWillReceiveProps(nextProps){

    }

    componentDidMount(){
      this.didMount = true
      
    }

    

    componentWillUnmount(){
      this.didMount = false
    }

    _addBookmark() {

    }

    closeBookmarkModal() {

    }
    _shareNews(){

    }
    fontChnage() {
    
    }
    _relatedNews(response){

    }

    _formatRelatestNews(data){

    }

    _callRelatedAPI(apiUrl, stateName){
      
    }

    _callAPI(apiUrl, stateName){
    
    }

    _handleImageSize(style,content){
        
    }

    _toggleMenu(){
      this.refs.menu._toggleMenu();
    }
    closeModal() {
      this.setState({ isModal: !this.state.isModal });
    }
    _handleNavigation(screenName, data) {

    }

    render(){
      var {height, width} = Dimensions.get('window')
      var pdf = 'https:\/\/dbv47yu57n5vf.cloudfront.net\/s3fs-public\/pullout\/20190621_ep_2911.pdf?lT7W4k3gZzr97gAJCT_xQ0XVMMJWleiX';

      return(
        <View>          
          <NavigationHelper
            ref={"navigationHelper"}
            navigation={this.props.navigation}
          />
          <View >
            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ padding: 23 }}>
              <Image
                    style={{ width: 40, height: 40 }}
                    source={backIcon}
                />
            </TouchableOpacity>
          </View>
          <View style={{backgroundColor: 'red', width: 400, height: 400 }}>
            <WebView
              source={{uri: 'http://www.africau.edu/images/default/sample.pdf'}}
              style={{marginTop: 20, width: 300, height: 300}}
              onLoad={()=> this.setState({loaded: true})}
            />
          </View>
          {!this.state.loaded? <Loading/>: <View/>}
        </View>
      )
    }
}
