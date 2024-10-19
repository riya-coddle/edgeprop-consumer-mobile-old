import React, { Component } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    ScrollView
} from 'react-native'
import firebase from 'react-native-firebase';
import appsFlyer from 'react-native-appsflyer';
import StatusBarBackground from '../../components/Common_iOSStatusBar/Common_iOSStatusBar'
import HeaderSearch from '../../components/Common_HeaderSearch/Common_HeaderSearch'
import Home_List from '../../components/Home_List/Home_List'
import LandingHighlight from '../../components/Common_LandingHighlight/Common_LandingHighlight.js'
import IconMenu from '../../components/Common_IconMenu/Common_IconMenu.js'
import NewsList from '../../components/News_List/News_List'
import dataMenu from '../../assets/json/menu.json'
import Common_Menu from '../../components/Common_Menu/Common_Menu.js'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import News_NewsDetail from '../../components/News_NewsDetail/News_NewsDetail.js'
import ShareHelper from '../../components/Common_ShareHelper/Common_ShareHelper.js'
import NewsActions from '../../realm/actions/NewsActions'

const HOSTNAME = "https://www.edgeprop.sg";
const PROXY_URL = "/proxy?url=";
const API_DOMAIN = "https://www.edgeprop.sg";
const API_GET_ARTICLE_DETAIL = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN + "/tep-solr/api/articles/getArticleDetails.php?");
const API_GET_RELATED_ARTICLES = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN + "/tep-solr/api/articles/getRelatedArticles.php?page=1&size=4")
const TIMEOUT = 1000;

export default class NewsDetail extends Component{

    static navigationOptions = ({ navigation }) => {
      var menu_icon = require('../../assets/icons/menu.png');
      var share_icon = require('../../assets/icons/share.png');
      var { state, setParams } = navigation;
      var {params} = state
      return {
        title: "News".toUpperCase(),
        headerRight: (
          <View style={
            {
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'flex-end',
              paddingRight: 5
            }
          }>
            <IconMenu
              imageWidth={28}
              imageHeight={28}
              paddingVertical={10}
              paddingHorizontal={5}
              type={"icon"}
              imageSource={share_icon}
              onPress={()=>params.shareNews()}/>
            <IconMenu
              imageWidth={20}
              imageHeight={20}
              paddingVertical={12}
              paddingHorizontal={10}
              type={"icon"}
              imageSource={menu_icon}
              onPress={()=>params.toggleMenu()}
              />
          </View>
        ),
      };
    };
    didMount;
    constructor(props) {
      super(props);
      this.navigation = props.navigation
      this.params = this.navigation.state.params
      this.newsDetailContent = this.params.data.newsDetailContent // this can be undefined
      this.nid = this.params.data.nid // this can be undefined
      this.alias = this.params.data.alias // this can be undefined

      this.NewsActions = new NewsActions();

      this.state = {
        displayMenu: false,
        newsDetail: this.NewsActions.GetNewsDetail(this.nid),
        relatedNews: this.NewsActions.GetRelatedNews(this.nid),
        // isFocused: true
      }
      this._callAPI = this._callAPI.bind(this);
      this._toggleMenu = this._toggleMenu.bind(this);
      this._shareNews = this._shareNews.bind(this);
      this._handleNavigation = this._handleNavigation.bind(this)
      this.navigation.setParams({
        toggleMenu: this._toggleMenu,
        shareNews: this._shareNews
      })
    }

    componentWillReceiveProps(nextProps){
      // this.setState({
      //   isFocused: nextProps.screenProps.stackKey == this.navigation.state.key
      // })
    }

    shouldComponentUpdate(nextProps, nextState){
      return JSON.stringify(nextState) != JSON.stringify(this.state)
    }

    componentDidMount(){
      this.didMount = true
      let nidParam = ''
      let aliasParam = ''
      if (this.newsDetailContent){
        // this is the handler if this component get data by passing nav-parameter
        nidParam = `&nid=${this.newsDetailContent.nid}`
        this.setState({newsDetail: this.newsDetailContent})
      }
      else{
        // this is the handler if this component doesnt get data from nav-paramter
        // so call api again
        nidParam = this.nid ? `&nid=${this.nid}` : '' // set nidParam if this.nid is defined
        aliasParam = this.alias ? `&alias=${this.alias}` : '' // set aliasParam if this.alias is defined
        newsDetailURL = API_GET_ARTICLE_DETAIL + encodeURIComponent(nidParam+aliasParam)
        this._callAPI(newsDetailURL, "newsDetail");
      }

      // always call related articles
      relatedNewsURL = API_GET_RELATED_ARTICLES + encodeURIComponent(nidParam+aliasParam)
      this._callAPI(relatedNewsURL, 'relatedNews')
    }

    componentDidUpdate(prevProps, prevState){
      if(JSON.stringify(prevState.newsDetail) != JSON.stringify(this.state.newsDetail)){
        this.NewsActions.CreateNewsDetail(this.state.newsDetail);
      }
      if(JSON.stringify(prevState.relatedNews) != JSON.stringify(this.state.relatedNews)){
        this.NewsActions.CreateRelatedNews(this.state.relatedNews, this.nid);
      }

    }

    componentWillUnmount(){
      this.didMount = false
    }

    _shareNews(){
      if(this.state.newsDetail.path){
          var aliasURL = HOSTNAME+"/"+this.state.newsDetail.path
          this.refs.share._share(aliasURL);
      }
    }

    _callAPI(apiUrl, stateName){
        // console.log(apiUrl);
      if(!this.state[stateName].results){
        fetch(apiUrl,
        {
          method: 'GET', timeout: TIMEOUT
        }).
        then((response) => response.json()).
        then((responseJson) => {
          if(responseJson){
            if(this.didMount){
              if(stateName === "newsDetail"){
                this.setState({
                  [stateName]: responseJson.response
                });
              }
              else{
                this.setState({
                  [stateName]: responseJson.response.results
                });
              }
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
      }
    }

    _toggleMenu(){
      this.refs.menu._toggleMenu();
    }

    _handleNavigation(screenName, data) {
      // Alert.alert('Comming soon ', `NewsItem Touched,\ncateogry: ${item.nid}\ntitle: ${item.title}`)
      if(screenName=="NewsDetail"){
          var length = 99;
          var trimmedTitle = data.title.length > length ?
                      data.title.substring(0, length - 3) + "..." :
                      data.title;
        // var ParamURL = HOSTNAME + "/" + data.path
        firebase.analytics().logEvent('View_Article_Related', { Title: trimmedTitle });
        firebase.analytics().logEvent('View_Article', { Title: trimmedTitle, Category:data.category });
        appsFlyer.trackEvent("View_Article", {},
            (result) => {
                console.log(result);
            },
            (error) => {
                console.error(error);
            }
        )
        this.refs.navigationHelper._navigate('NewsDetail', {
          data: {
            nid: data.nid
          }
        })
      }
      else if(screenName=="NewsCategory"){
        this.refs.navigationHelper._navigate('NewsCategory', {
          data: {
            category: data
          }
        })
      }
    }

    render(){
      // if(!this.state.isFocused){
      //   return <View/>
      // }
      return(
        <View style={{flex:1}}>
          <NavigationHelper
            ref={"navigationHelper"}
            navigation={this.props.navigation}
          />
          <ShareHelper
            ref={"share"}
            message={"This news might interest you"}
          />
          <Common_Menu
            ref={"menu"}
            navigation = {this.props.navigation}
          />
          <ScrollView
              removeClippedSubviews={true}
              >
              <News_NewsDetail
                navigation={this.props.navigation}
                data={this.state.newsDetail}
                relatedData={this.state.relatedNews}
                handleNavigation={this._handleNavigation}
              />
          </ScrollView>
        </View>
      )
    }
}