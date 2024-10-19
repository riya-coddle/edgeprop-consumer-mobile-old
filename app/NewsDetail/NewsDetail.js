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
    AsyncStorage
} from 'react-native'
import Button from '../../components/Common_Button/Common_Button';
//import MyWebView from 'react-native-webview-autoheight';
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
import NewsActions from '../../realm/actions/NewsActions';
import ModalLanding from '../ModalLanding/ModalLanding.js';
import BookmarkModal from '../BookmarkModal/BookmarkModal.js'
import styles from './NewsDetailStyle';
import Loading from '../../components/Common_Loading/Common_Loading'
import MultiTapHandler from '../../app/MultipleTapHandler/MultiTapHandler.js'


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
var fontIcon     = require('../../assets/icons/font-icon-news.png');
var back     = require('../../assets/icons/left-news.png');

export default class NewsDetail extends Component{

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
      this.content = this.params.data.url.replace("https://www.edgeprop.my/", "");
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
        hasNews: false,
        darkMode: this.params.data.darkMode? this.params.data.darkMode: false,
        fontFactor : this.params.data.fontFactor? this.params.data.fontFactor : 0,
        disableHigh: this.params.data.disableHigh? this.params.data.disableHigh : false,
        disableLow: this.params.data.disableLow? this.params.data.disableLow : true 
        // isFocused: true
      }
      this._callAPI = this._callAPI.bind(this);
      this._toggleMenu = this._toggleMenu.bind(this);
      this._shareNews = this._shareNews.bind(this);
      this._handleNavigation = this._handleNavigation.bind(this);
      this._handleImageSize = this._handleImageSize.bind(this);
      this._relatedNews = this._relatedNews.bind(this);
      this._callRelatedAPI = this._callRelatedAPI.bind(this);
      this.closeModal = this.closeModal.bind(this);
      this._addBookmark = this._addBookmark.bind(this)
      this.closeBookmarkModal = this.closeBookmarkModal.bind(this)
      this.fontChnage = this.fontChnage.bind(this)
      this._handleDarkMode = this._handleDarkMode.bind(this)
      this._handleFontSize = this._handleFontSize.bind(this)
      this._goBack = this._goBack.bind(this)
      this._formatMoney = this._formatMoney.bind(this)
      this._formatNumber = this._formatNumber.bind(this)
      this._formatFeatured = this._formatFeatured.bind(this)
      this._handleOnPressListing = this._handleOnPressListing.bind(this)
      this.doNothing = this.doNothing.bind(this)
      
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

    async componentDidMount(){
      this.didMount = true
      let nidParam = ''
      let aliasParam = ''
      //console.log('nid =', this.nid);
      newsDetailURL = API_NEWS_DETAILS+this.nid
      this._callAPI(newsDetailURL, "newsDetail");
      // always call related articles
      relatedNewsURL = API_GET_RELATED_ARTICLES + encodeURIComponent(nidParam+aliasParam)
      //this._callRelatestAPI(relatedNewsURL, 'relatedNews')

      let fontSetting = JSON.stringify({
        fontFactor: 0,
        disableHigh: false,
        disableLow: true,
      });
      try {
        const dark = await AsyncStorage.getItem("darkMode") || JSON.stringify({darkMode: false});
        const fontSettings = await AsyncStorage.getItem("fontSetting") || fontSetting;
        let settings = JSON.parse(fontSettings);
        let darkMode = JSON.parse(dark);
        this.setState({ 
          darkMode: darkMode.darkMode,
          fontFactor: settings.fontFactor,
          disableHigh: settings.disableHigh,
          disableLow: settings.disableLow,
        })

      } catch (error) {
        // Error retrieving data
        console.log(error.message);
      }
    }

    /*componentDidUpdate(prevProps, prevState){
      if(JSON.stringify(prevState.newsDetail) != JSON.stringify(this.state.newsDetail)){
        //this.NewsActions.CreateNewsDetail(this.state.newsDetail);
      }
      if(JSON.stringify(prevState.relatedNews) != JSON.stringify(this.state.relatedNews)){
        //this.NewsActions.CreateRelatedNews(this.state.relatedNews, this.nid);
      }

    }*/

    componentWillUnmount(){
      this.didMount = false
    }

    doNothing() {
      console.log('ref'); 
    }

    _handleOnPressListing(item, index) {
       
        let mapData = item.location_p?item.location_p.split(/\s*,\s*/):'';
        this.refs.navigationHelper._navigate('ListingDetailNav', {
            data: {
                property_id: item.property_id,
                listing_type: item.listing_type == 'rent'?'rental':item.listing_type,
                key: item.key,
                uid: item.uid,
                nid: item.nid,
                mid: item.mid,
                lat: mapData[0]?mapData[0]:0,
                lan: mapData[1]?mapData[1]:0,
                state: item.state,
                area: item.district,
                project: item.title,
                shortlisted: item.shortlist?true: false,
                itemId: item.id?item.id:0,
                newLaunch:false
            },
            onGoBack: this.doNothing
        }) 
    }

     _formatMoney(val) {
        return val ? 'RM ' + this._formatNumber(val) : '-'
      }

    _formatNumber(num) {
        if(num) {
          return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        }
      }

      _formatFeatured(result) {
        let response = [];
        for (var index = 0; index < result.length; index++) {
            let data = result[index];
            let item = {};
            item.images = data.field_prop_images_txt? data.field_prop_images_txt :[];
            if(item.images.length == 0) {
              item.images.push('https://dkc9trqgco1sw.cloudfront.net/s3fs-public/default_images/no_img.png')
            }
            if(data.field_property_type_i) {
                  if(data.field_property_type_i == 36) {
                    if(data.field_prop_land_area_d) {
                        item.total_sqft = data.field_prop_land_area_d? data.field_prop_land_area_d : 0;    
                        item.perSqft    = data.field_prop_price_pu_d? data.field_prop_price_pu_d : 0;
                    }
                    if(data.field_prop_built_up_d) { 
                        item.total_sqft = data.field_prop_built_up_d? data.field_prop_built_up_d : 0;   
                        item.perSqft    = data.field_prop_built_up_price_pu_d? data.field_prop_built_up_price_pu_d : 0; 
                    }
                  }
                if(data.field_property_type_i != 36) {
                  if(data.field_prop_built_up_d) { 
                       item.total_sqft = data.field_prop_built_up_d? data.field_prop_built_up_d : 0;   
                        item.perSqft    = data.field_prop_built_up_price_pu_d? data.field_prop_built_up_price_pu_d : 0; 
                  }
                  if(data.field_prop_land_area_d) {   
                        item.total_sqft = data.field_prop_land_area_d? data.field_prop_land_area_d : 0;    
                        item.perSqft    = data.field_prop_price_pu_d? data.field_prop_price_pu_d : 0;
                  }   
                }   
            } 
            item.title = data.title_t;
            item.nid = data.nid_i?data.nid_i:0;
            item.mid = data.mid_i?data.mid_i:0;
            item.asking_price = data.field_prop_asking_price_d? this._formatMoney(data.field_prop_asking_price_d): '';
            item.bedrooms = data.field_prop_bedrooms_i? data.field_prop_bedrooms_i : 0;
            item.bathrooms = data.field_prop_bathrooms_i? data.field_prop_bathrooms_i : 0;
            item.property_id = (data.nid_i && data.nid_i >0)? data.nid_i: data.mid_i;
            item.listing_type = data.type_s;
            item.key = (data.nid_i && data.nid_i >0)? 'n': 'm';
            item.uid = data.uid_i;
            item.location_p = data.location_p;
            item.state = data.state_s_lower;
            item.district = data.district_s_lower;
            item.id = data.id;

            response.push(item);
        }

        return response;
    }


    _addBookmark() {
      this.setState({ bookmark: true })
    }

    closeBookmarkModal() {
      this.setState({ bookmark: false }) 
    }
    _shareNews(){
     // console.log('_shareNews',this.url);
      if(this.url){
          var aliasURL = this.url
          this.refs.share._share(aliasURL);
      }
    }
    fontChnage() {
      this.setState({ isModal: !this.state.isModal });     
    }

    _goBack(){
      if(this.props.navigation.goBack)
        this.props.navigation.goBack()
    }

    _relatedNews(response){
      //console.log('news response =', response);
      let countryId = response.country_id;
      let tag = null;
      let nid = response.nid;
      tag = response.tagids;
      countryId = 1; 
      if(countryId&&tag&&nid){
        let endPoint = API_RELATED_NEWS + encodeURIComponent(tag)+'/'+nid+'/'+countryId;
        //console.log('endPoint',endPoint);
        this._callRelatedAPI(endPoint, 'relatedNews')
      }
    }

    _formatRelatestNews(data){
      let relatedNews = [];
      relatedNews = data.map(function(item) {
        var date = new Date(item.node.created).getTime() / 1000;
          return {
              nid: item.node.nid,
              node_title: item.node.title,
              node_created: date,
              news_thumbnail: item.node.field_image.src,
              path: item.node.path,
              url: 'https://www.edgeprop.my'+item.node.path,
              field_category: item.node.field_category,
              body: item.node.body
            };
      });
      //console.log('relatedNews',relatedNews);
      return relatedNews;
    }

    _callRelatedAPI(apiUrl, stateName){
        //console.log('apiUrl',apiUrl);
      let param = "path="+this.content;
      if(!this.state[stateName].results){
        fetch(apiUrl,
        {
          method: 'GET', timeout: TIMEOUT
        }).
        then((response) => response.json()).
        then((responseJson) => {
          if(responseJson){
            //console.log('responseJson',responseJson);
            if(this.didMount){
              let relatedNews = this._formatRelatestNews(responseJson.nodes);
              this.setState({
                relatedNews: relatedNews
              });
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
      }
    }

    _callAPI(apiUrl, stateName){
    console.log('apiUrl',apiUrl);
      let param = "path="+this.content;
      if(!this.state[stateName].results){
        fetch(apiUrl,
        {
          method: 'GET', timeout: TIMEOUT
        }).
        then((response) => response.json()).
        then((responseJson) => {
          if(responseJson){
            //console.log(stateName,responseJson);
            if(this.didMount){
              if(stateName === "newsDetail"){
                //console.log(responseJson.body.und[0].safe_value);
                if(this.url == '') {
                  this.content = responseJson.url;
                  this.url = 'https://www.edgeprop.my/'+responseJson.url;
                }
                this.setState({
                  [stateName]: responseJson,
                  hasNews : true
                });
                this._relatedNews(responseJson);
                /*if(responseJson.body && responseJson.body.und){

                  this._relatedNews(responseJson);
                  let text = responseJson.body.und[0].safe_value;
                  let regx = /(style=")([a-zA-Z0-9:;\.\s\(\)\-\,]*)(")/gi;
                  var matches = text.match(regx);
                  this._handleImageSize(matches, text)
                  this.setState({
                      author: responseJson.field_author.und[0].safe_value,
                      created: Moment.unix(responseJson.created).format("MMMM DD, YYYY"),
                      title: responseJson.title
                  })
                }*/
                

              }
              else{
                /*this.setState({
                  [stateName]: responseJson.response.results
                });*/
              }
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
      }
    }

    _handleImageSize(style,content){
        //console.log('content',content);
        //content = content.replace('src="http://','src="https://');
        let regx = /src\s*=\s*"(.+?)"/gi;
        var matches = content.match(regx);
        //console.log('maches src',matches);
        if(matches && matches.length > 0){
          for(let j=0;j<matches.length; j++){
            let imgPrev = matches[j];
            let img = imgPrev.replace('src="http://','src="https://');
            content = content.replace(imgPrev,img);
          }
        }
        //console.log('content src',content);
        if(style && style.length >0){
            //style="width: 352px; height: 232px;"
            for(let i=0;i<style.length; i++){
                let stylePrev = style[i];
                let dim = stylePrev;
                    dim = dim.replace('style="','')
                    dim = dim.replace('"','')
                    dim = dim.split(';')
                let width = dim[0].replace('width:','')
                    width = width.replace('px','')
                    width = width.trim();
                let height = dim[1].replace('height:','')
                    height = height.replace('px','')
                    height = height.trim();
                //console.log('width',width);
                //console.log('height',height);
                if(width > DEVICEWIDTH){
                    let aspectRatio = height / width;
                    //console.log('aspectRatio',aspectRatio);
                    //console.log('DEVICEWIDTH',DEVICEWIDTH);
                    let newWidth = DEVICEWIDTH * .965;
                    let newHeight = newWidth * aspectRatio;
                    //console.log('newHeight',newHeight);
                    let newStyle = 'style="width: '+parseInt(newWidth)+'px; height: '+parseInt(newHeight)+'px;"';
                    //console.log('newStyle',newStyle);
                    //console.log('stylePrev',stylePrev);
                    content = content.replace(stylePrev,newStyle);
                }
            }
        }
        /*this.setState({
          newsDetail: content
        });*/
        //console.log('newsDetail',this.state.newsDetail);
    }

    _toggleMenu(){
      this.refs.menu._toggleMenu();
    }
    closeModal() {
      this.setState({ isModal: !this.state.isModal });
    }
    _handleNavigation(screenName, data) {
      // Alert.alert('Comming soon ', `NewsItem Touched,\ncateogry: ${item.nid}\ntitle: ${item.title}`)
      if(screenName=="NewsDetail"){
          var length = 99;
          var trimmedTitle = data.node_title.length > length ?
                      data.node_title.substring(0, length - 3) + "..." :
                      data.node_title;
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
            url: 'https://www.edgeprop.my'+data.path,
            nid: data.nid,
            darkMode: data.darkMode? true : false
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


    async _handleDarkMode(){
      try {
        await AsyncStorage.setItem("darkMode", JSON.stringify({darkMode : !this.state.darkMode}))
         .then( ()=>{
            this.setState({darkMode : !this.state.darkMode});
         } )
         .catch( ()=>{
            console.log("There was an error saving the darkMode")
         } )
      } catch (error) {
        // Error saving data
        console.log('error msg');
      }
    }

    async _handleFontSize(fontFactor, disableHigh, disableLow){
      let fontSetting = {
        fontFactor,
        disableHigh,
        disableLow,
      };
      try {
        await AsyncStorage.setItem("fontSetting", JSON.stringify(fontSetting))
         .then( ()=>{
            this.setState({
              fontFactor,  
              disableHigh,
              disableLow
            })
         } )
         .catch( ()=>{
            console.log("There was an error saving the font settings")
         } )
      } catch (error) {
        // Error saving data
        console.log('error msg');
      }
      console.log(fontFactor,disableHigh,disableLow)
    }

    render(){
      // if(!this.state.isFocused){
      //   return <View/>
      // }
      //console.log(this.props)
      var { state, setParams } = this.navigation;
      var {params} = state
      const {width, height} = Dimensions.get('window');
      var _renderTitleText = () => {
        let title = '';
        if(this.state.author && this.state.created){
          title =  this.state.author +' / '+this.state.created;
        } else if(this.state.author){
          title =  this.state.author;
        }else if(this.state.created){
          title =  this.state.created;
        }
        return title;
      }

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
          {!this.state.hasNews && (
            <Loading  />
          )}
          {this.state.isModal && (
              <View>
                  <ModalLanding 
                    modalVisible={this.state.isModal} 
                    closeModal={this.closeModal}
                    handleDarkMode={this._handleDarkMode}
                    handleFontSize={this._handleFontSize}
                    darkMode={this.state.darkMode}
                    fontFactor={this.state.fontFactor}
                    disableHigh={this.state.disableHigh}
                    disableLow={this.state.disableLow}
                  />
              </View>    
            )}
            {this.state.bookmark && (
              <View>
                  <BookmarkModal 
                    coverImage={this.state.newsDetail.cover_img}
                    modalVisible={this.state.bookmark} 
                    closeModal={this.closeBookmarkModal}
                  />
              </View>    
            )}
          <ScrollView
              removeClippedSubviews={true}
              >
            <News_NewsDetail
              navigation={this.props.navigation}
              data={this.state.newsDetail}
              relatedData={this.state.relatedNews}
              isRelated={true}
              handleNavigation={this._handleNavigation}
              formatFeatured = {this._formatFeatured}
              handleOnPressListing = {this._handleOnPressListing}
              darkMode={this.state.darkMode}
              fontFactor={this.state.fontFactor}
            />
          </ScrollView>
          
          <View style={{flex:1}}>
                <View style={styles.bottomIcons}>
                  <View style={styles.iconContainer}>
                      <TouchableOpacity 
                      onPress={MultiTapHandler(() => this._goBack(), true ? 1000 : 0)}
                      style={styles.fullWidthButton}
                      >
                        <Image
                            style={{ width: 22, height: 22 }}
                            source={back}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity 
                      onPress={MultiTapHandler(() => this._shareNews(), true ? 1000 : 0)}
                      style={styles.fullWidthButton}
                      >
                        <Image
                            style={{ width: 22, height: 22 }}
                            source={upload}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={this.fontChnage} style={styles.fullWidthButton}>
                        <Image
                            style={{ width: 22, height: 22 }}
                            source={fontIcon}
                        />
                      </TouchableOpacity>
                  </View>  
                </View>
              </View>
        </View>
      )
    }
}
