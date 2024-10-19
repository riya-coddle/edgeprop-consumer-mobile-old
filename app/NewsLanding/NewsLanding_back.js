import React, { Component } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    ScrollView,
    Button,
    Linking,
    NetInfo
} from 'react-native'
import firebase from 'react-native-firebase';
import appsFlyer from 'react-native-appsflyer';
import StatusBarBackground from '../../components/Common_iOSStatusBar/Common_iOSStatusBar'
import HeaderSearch from '../../components/Common_HeaderSearch/Common_HeaderSearch'
import Home_List from '../../components/Home_List/Home_List'
import LandingHighlight from '../../components/Common_LandingHighlight/Common_LandingHighlight.js'
import IconMenu from '../../components/Common_IconMenu/Common_IconMenu.js'
import NewsList from '../../components/News_List/News_List'
import Common_MenuList from '../../components/Common_MenuList/Common_MenuList'
import dataMenu from '../../assets/json/menu.json'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import Common_Menu from '../../components/Common_Menu/Common_Menu'
import Loading from '../../components/Common_Loading/Common_Loading'
import NewsCategory from '../NewsCategory/NewsCategory.js'
import NewsSearchResult from '../NewsSearchResult/NewsSearchResult'
import NewsActions from '../../realm/actions/NewsActions'

const HOSTNAME = "https://www.edgeprop.sg";
const PROXY_URL = "/proxy?url=";
const API_DOMAIN = "https://api.theedgeproperty.com.sg";
// const API_GET_MAIN_FEATURED_TOPICS = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN + "/featuerdtopics/list?pageSize=4");
const API_GET_FEATURED_PROPERTY_NEWS = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN + "/news/getallnews?type=featured&pageSize=5");
const RELATED_ARTICLE_SIZE = 4;
const API_GET_ARTICLE_DETAIL = HOSTNAME + PROXY_URL + encodeURIComponent("https://www.edgeprop.sg" + "/tep-solr/api/articles/getArticleDetails.php?");
const PAGE_SIZE = 20;
const API_GET_NEWS_LIST = HOSTNAME + PROXY_URL + encodeURIComponent(HOSTNAME + "/tep-solr/api/articles/getArticles.php?withtotal=true&size=" + PAGE_SIZE);
const TIMEOUT = 1000;

export default class NewsLanding extends Component {

    pageCount = 1;
    totalPage = 1;
    defaultMainPropertyNews = {}
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.navigation = props.navigation
        this.NewsActions = new NewsActions();
        this.defaultMainPropertyNews = this.NewsActions.GetLatestNews();
        this.state = {
            keywordSearch: '',
            mainFeaturedTopics: {},//this.NewsActions.GetFeaturedTopics(),
            mainPropertyNews: {},
            isFocused: true
        }
        this.iconClose = require('../../assets/icons/Close.png');

        this._handleMenuButton = this._handleMenuButton.bind(this);
        this._callAPI = this._callAPI.bind(this);
        this._sendAPIRequest = this._sendAPIRequest.bind(this);
        this._sendNewsAPIRequest = this._sendNewsAPIRequest.bind(this);
        this._handlerOnSubmitEditing = this._handlerOnSubmitEditing.bind(this);
        this._handleOnNewsItemPress = this._handleOnNewsItemPress.bind(this);
        this._handleOnHighlightPress = this._handleOnHighlightPress.bind(this);

        this._handleLoadMore = this._handleLoadMore.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        //if go back(focused=false->focused=true) then setState for mainPropertyNews
        // if (this.state.isFocused && nextProps.screenProps.tabKey != this.navigation.state.key) {
        //     this.pageCount = 1
        //     this.setState({
        //         mainPropertyNews: this.defaultMainPropertyNews
        //     })
        // }
        // this.setState({
        //     isFocused: nextProps.screenProps.tabKey == this.navigation.state.key,
        // })
    }

    shouldComponentUpdate(nextProps, nextState) {

      if(JSON.stringify(nextState.mainFeaturedTopics) != JSON.stringify(this.state.mainFeaturedTopics)){
        //this.NewsActions.CreateFeaturedTopics(nextState.mainFeaturedTopics);
        return true;
      }
      /*
      if(JSON.stringify(nextState.mainPropertyNews) != JSON.stringify(this.state.mainPropertyNews)){
        this.NewsLandingActions.CreateLatestNews(nextState.mainPropertyNews);
        return true;
      }*/

      return JSON.stringify(nextState) != JSON.stringify(this.state)
    }

    componentDidMount() {
        this._callAPI(API_GET_FEATURED_PROPERTY_NEWS, "mainFeaturedTopics", "normal")
        this._callAPI(API_GET_NEWS_LIST, "mainPropertyNews", "news")
        firebase.analytics().logEvent('View_Article_Category', { Category: 'Landing' });
    }

    _validateData(currentData, incomingData, latestSize) {
        latestSize = latestSize || currentData.length
        start = currentData.length - latestSize > 0 ? currentData.length - latestSize : 0
        currrentData = currentData.slice(start)
        validatedData = []
        i = 0
        flag = true
        while (i < incomingData.length) {
            j = 0
            flag = true
            while (j < currentData.length && flag) {
                if (incomingData[i].nid === currentData[j].nid) {
                    flag = false
                }
                j++
            }
            if (flag) {
                validatedData.push(incomingData[i])
            }
            i++
        }

        return validatedData
    }

    _callAPI(apiUrl, stateName, type) {
      	NetInfo.isConnected.fetch().then(isConnected => {
        	if (isConnected) {
            if(type == 'news'){
              this._sendNewsAPIRequest(apiUrl, stateName);
            }else{
              this._sendAPIRequest(apiUrl, stateName);
            }
       	  }
        });
    }

    _sendAPIRequest(apiUrl, stateName){
      if (!this.state[stateName].results) {
          fetch(apiUrl,
          {
              method: 'GET', timeout: TIMEOUT
          }).
          then((response) => response.json()).
          then((responseJson) => {
            console.log('_sendAPIRequest',responseJson);
             if (responseJson) {
                  this.setState({
                      [stateName]: responseJson.results
                  });
              }
          })
          .catch((error) => {
              console.log(error);
          });
      }
    }

    _sendNewsAPIRequest(apiUrl, stateName){
      if (!this.state[stateName].results) {
        fetch(apiUrl,
        {
            method: 'GET', timeout: TIMEOUT
        }).
        then((response) => response.json()).
        then((responseJson) => {
            if (responseJson) {
                console.log('_sendNewsAPIRequest',responseJson);
                if (this.totalPage != responseJson.response.total) {
                    this.totalPage = responseJson.response.total;
                }

                if (this.state[stateName].length > 0) {
                    this.setState({
                        [stateName]: [...this.state[stateName], ...this._validateData(this.state[stateName], responseJson.response.results, 2 * this.PAGE_SIZE)]
                    });
                }
                else {
                    this.setState({
                        [stateName]: responseJson.response.results
                    });
                }
            }
        })
        .catch((error) => {
            console.log(error);
        });
      }
    }

    _getAPIResponse(apiUrl, callback) {
        fetch(apiUrl,
            {
                method: 'GET', timeout: TIMEOUT
            }).
            then((response) => response.json()).
            then((responseJson) => {
                if (responseJson) {
                    console.log('_getAPIResponse',responseJson);
                    callback(responseJson.response, null)
                }
            })
            .catch((error) => {
                callback(null, error);
            });
    }

    _directToBrowser(url) {
        if (url.length > 0) {
            Linking.canOpenURL(url).then(supported => {
                if (!supported) {
                    console.log('Can\'t handle url: ' + url);
                } else {
                    return Linking.openURL(url);
                }
            }).catch(err => console.error('An error occurred', err));
        }
    }

    _handlerOnPressHeaderSearch() {
        Alert.alert("Comming Soon", `Common HeaderSearch Touched, this feature will be coming soon`);
    }

    _handleMenuButton() {
        this.refs.menu._toggleMenu()
    }

    _handlerOnSubmitEditing(text) {
        this.refs.navigationHelper._navigate('NewsSearchResult', {
            data: {
                keyword: text
            }
        })
        this.refs.headerSearch.clearText()
    }

    _handleOnHighlightPress(item) {
        let url = item.url
        console.log('url',url);
        if (url.includes('/property-news-search?')) {

            keyword = url.match(/combine=.*?(?=&|$)/i)[0].replace('combine=', '')
            console.log('/property-news-search?',keyword)
            this.refs.navigationHelper._navigate('NewsSearchResult', {
                data: {
                    keyword: keyword.replace('%20', ' ')
                }
            })
        }
        else if (url.includes('/content/')) {

            title = url.match(/content[^%]*/i)[0].replace('content/', '')
            alias = 'property-news/' + title
            url = API_GET_ARTICLE_DETAIL + encodeURIComponent("&alias=" + alias)
            _this = this
            this._getAPIResponse(url, function (data, err) {
                if (data.length <= 0 || err || !data) {
                    // handle if response is error or empty data
                    this._directToBrowser(url)
                }
                else {
                    console.log('/content/',data)
                    _this.refs.navigationHelper._navigate('NewsDetail', {
                        data: {
                            newsDetailContent: data
                        }
                    })
                }
            })
        }
        else if (url.includes('/property-news/')) {

            title = url.match(/property-news[^%]*/i)[0].replace('property-news/', '')
            alias = 'property-news/' + title

            var length = 99;
            var trimmedTitle = item.title.length > length ?
                        item.title.substring(0, length - 3) + "..." :
                        item.title;
            console.log('/property-news/',alias)
            // var ParamURL = HOSTNAME + "" + item.url
            firebase.analytics().logEvent('View_Article', { Title: trimmedTitle, Category:'LandingHighlight' });
            this.refs.navigationHelper._navigate('NewsDetail', {
                data: {
                    alias: alias
                }
            })
        }
        else if (url.includes('/property-news?')) {

            category = url.match(/cat=.*?(?=&|$)/i)[0].replace('cat=', '')
            console.log('/property-news?',category)
            this.refs.navigationHelper._navigate('NewsCategory', {
                data: {
                    category: category
                }
            })
        }
        else {
            this._directToBrowser(url)
        }
    }

    _handleOnNewsItemPress(item) {
        var length = 99;
        var trimmedTitle = item.title.length > length ?
                    item.title.substring(0, length - 3) + "..." :
                    item.title;

        // var ParamURL = HOSTNAME + "/" + item.path
        console.log(trimmedTitle, item);
        firebase.analytics().logEvent('View_Article', { Title: trimmedTitle, Category:item.category });
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
                nid: item.nid
            }
        })
    }

    _handleLoadMore() {
        this.pageCount++;
        if (this.pageCount <= Math.ceil(this.totalPage / PAGE_SIZE)) {
            var page = '&page=' + this.pageCount.toString();
            this._callAPI(API_GET_NEWS_LIST + encodeURIComponent(page), "mainPropertyNews", "news")
        }
    }

    render() {
        if (this.pageCount == 1 && this.state.mainPropertyNews.length > 0) {
            this.defaultMainPropertyNews = this.state.mainPropertyNews
            this.NewsActions.CreateLatestNews(this.defaultMainPropertyNews);
        }
        var icon = require('../../assets/icons/menu_more.png');
        // if (!this.state.isFocused) {
        //     return <View />
        // }

        return (
            <View style={{ flex: 1 }}>
                <Common_Menu ref={"menu"} navigation={this.props.navigation} />
                <NavigationHelper
                  ref={"navigationHelper"}
                  navigation={this.props.navigation}
                />
                <View style={{ flex: 1 }}>
                    <StatusBarBackground lightContent={true} style={{ backgroundColor: '#275075' }} />
                    {/* Header */}
                    <View style={
                        {
                          flexDirection: 'row',
                          backgroundColor: '#275075',
                          paddingLeft: 10,
                          paddingVertical: 15,
                          alignItems: 'center'
                        }}>
                        <View style={
                            {
                                flex: 1,
                            }}>
                            <HeaderSearch
                              ref={'headerSearch'}
                              hintText={'Search News'}
                              editable={true}
                              fontSize={15}
                            //   onChangeText={this._handlerOnChangeText}
                              showIconSearch={true}
                              onSubmitEditing={this._handlerOnSubmitEditing}
                            />
                        </View>
                        <View>
                            <IconMenu
                              imageWidth={22}
                              imageHeight={15}
                              padding={10}
                              type={"icon"}
                              imageSource={icon}
                              onPress={this._handleMenuButton} />
                        </View>
                    </View>
                    {/* News Landing Content */}
                    <View style={{flex:1 /*paddingBottom:90*/}}>
                        <NewsList style={{ flex: 1}}
                          type={"landing"}
                          typeData={this.state.mainFeaturedTopics}
                          headerTxtValue={'Property News'}
                          items={this.state.mainPropertyNews.length > 0 ? this.state.mainPropertyNews : this.defaultMainPropertyNews}
                          onItemPress={this._handleOnNewsItemPress}
                          onHighlightPress={this._handleOnHighlightPress}
                          onLoadMore={this._handleLoadMore}
                          isEndOfData={this.pageCount >= this.PAGE_SIZE} />
                        {(Object.keys(this.state.mainPropertyNews).length==0)?
                          <Loading/>:
                          <View/>
                        }
                    </View>

                </View>
            </View>
        )
    }
}
