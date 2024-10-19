import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  Button,
  Share,
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
import dataMenu from '../../assets/json/menu.json'
import Common_Menu from '../../components/Common_Menu/Common_Menu.js'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import ShareHelper from '../../components/Common_ShareHelper/Common_ShareHelper.js'
import NewsActions from '../../realm/actions/NewsActions'

const HOSTNAME = "https://www.edgeprop.sg";
const PROXY_URL = "/proxy?url=";
const API_DOMAIN = "https://www.edgeprop.sg";

//const API_GET_ARTICLES = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN + "/tep-solr/api/articles/getArticles.php?");
const API_GET_ARTICLES = "https://www.edgeprop.sg/tep-solr/api/articles/getArticles.php?";
const ALIAS = "/property-news?cat="
const TIMEOUT = 1000;
const API_NEWS_LIST = "https://slimapi.edgeprop.my/newsmobile";

export default class NewsCategory extends Component {
  navigation = {}
  params = {}
  category = ''
  firstData = []
  categoryURL = ''
  didMount = false
  calledData = 0
  page = 1
  totalPage = 1
  size = 20
  // indexToScroll

  static navigationOptions = ({ navigation }) => {
    var menu_icon = require('../../assets/icons/menu.png');
    var share_icon = require('../../assets/icons/share.png');
    var { state, setParams } = navigation;
    var category = state.params.data.category || "news"
    var { params } = state
    return {
      title: category.toUpperCase(),
      headerRight: (
        <View style={
          {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingVertical: 5,
          }
        }>
        <View display={'none'}>
          <IconMenu
            imageWidth={28}
            imageHeight={28}
            paddingVertical={10}
            paddingHorizontal={5}
            type={"icon"}
            imageSource={share_icon}
            onPress={() => params.shareNews()}
          />
        </View>
          <IconMenu
            imageWidth={20}
            imageHeight={20}
            paddingVertical={12}
            paddingHorizontal={10}
            type={"icon"}
            imageSource={menu_icon}
            onPress={() => params.toggleMenu()} />
        </View>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.navigation = props.navigation
    this.params = this.navigation.state.params
    this.NewsActions = new NewsActions();
    this.state = {
      categoryList: {},
      // isFocused: true
    }
    this.categoryURL = '';
    this._callAPI = this._callAPI.bind(this);
    this._toggleMenu = this._toggleMenu.bind(this);
    this._shareNews = this._shareNews.bind(this);
    this._handleOnNewsItemPress = this._handleOnNewsItemPress.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this)
    this._changeURL = this._changeURL.bind(this)
    this.navigation.setParams({
      toggleMenu: this._toggleMenu,
      shareNews: this._shareNews
    })
  }

  _init() {
    if (this.params.data != undefined) {
      if (this.params.data.category != undefined && this.params.data.category != this.category) {
        this.category = this.params.data.category
        this.category = this.category.replace(" ", "");
      }
    }
  }

  _toggleMenu() {
    this.refs.menu._toggleMenu();
  }

  _shareNews() {
    var aliasURL = HOSTNAME + ALIAS + encodeURIComponent(this.category)
    this.refs.share._share(aliasURL);
  }

  _changeURL() {
    this.postParam = "field_category_value="+this.category+"&page="+this.page;
    //this.categoryURL = API_GET_ARTICLES + "category=" + encodeURIComponent(this.category) + `&page=` + this.page.toString() + `&size=` + this.size.toString() + `&orderby=posted_desc&&withtotal=true`
  }

  componentWillReceiveProps(nextProps) {
    // this.setState({
    //   isFocused: nextProps.screenProps.stackKey == this.navigation.state.key,
    // })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (JSON.stringify(nextState) != JSON.stringify(this.state))
  }

  componentDidMount() {
    this.didMount = true
    this._changeURL();
    this._callAPI(API_NEWS_LIST, "categoryList");
  }

  componentWillUnmount() {
    this.didMount = false
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

  componentDidUpdate(prevProps, prevState) {
    // if (!prevState.isFocused && this.state.isFocused) {
    //   if (this.refs.newslist && this.indexToScroll) {
    //     this.refs.newslist._scrollToIndex(this.indexToScroll)
    //   }
    // }
  }

  _handleFirstData(result, isRealm = false){
    if (this.calledData == 1 || isRealm) {
      this.defaultCategoryPropertyNews = result;
      if (Array.isArray(result)) {
        this.firstData = []
        var first = result.shift()
        if (first != undefined) {
          this.firstData.push(first);
        }
      }
    }

    return result;
  }

  _callAPI(apiUrl, stateName) {
    //console.log('apiUrl',apiUrl);
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        if (!this.state[stateName].results) {
          fetch(apiUrl,
            {
              method: 'POST',
              headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'}),
              body: this.postParam
            }).
            then((response) => response.json()).
            then((responseJson) => {
              if (responseJson) {
                //console.log('responseJson',responseJson);
                if (this.totalPage < Math.ceil(responseJson.response.total / this.size)) {
                  this.totalPage = responseJson.response.total
                }
                this.calledData++;
                var temps = responseJson.response.results;
                if (this.calledData == 1) {
                  //store realm data
                  this.NewsActions.CreateCategoryNews(responseJson.response.results, this.category);
                }
                temps = this._handleFirstData(temps);
                if (this.didMount) {
                  if (this.state[stateName].length > 0) {
                    this.setState({
                      [stateName]: [...this.state[stateName], ...this._validateData(this.state[stateName], temps, 2 * this.size)]
                    });
                  }
                  else {
                    this.setState({
                      [stateName]: temps
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
    });
  }

  onLoadMore() {
    this.page++
    if (this.page <= this.totalPage) {
      this._changeURL()
      this._callAPI(API_NEWS_LIST, "categoryList")
    }
  }

  _handleOnNewsItemPress(item, index) {
    // Alert.alert('Comming soon ', `NewsItem Touched,\ncateogry: ${item.nid}\ntitle: ${item.title}`)
    // if (index) {
    //   this.indexToScroll = index
    // }
    //console.log('item',item);
    var length = 99;
    var trimmedTitle = item.node_title.length > length ?
                item.node_title.substring(0, length - 3) + "..." :
                item.node_title;
    // var ParamURL = HOSTNAME + "/" + item.path
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
        url: 'https://www.edgeprop.my/'+item.path,
        nid: item.nid
      }
    })
  }

  render() {
    this._init();
    // console.log("render");
    // if (!this.state.isFocused) {
    //   return <View />
    // }
    var data = this.state.categoryList;

    if(this.state.categoryList.length > 0){
      data = this.state.categoryList;
    }
    else{
      this.defaultCategoryPropertyNews = this.NewsActions.GetCategoryNews(this.category)
      this.defaultCategoryPropertyNews = this._handleFirstData(this.defaultCategoryPropertyNews, true);
      data = this.defaultCategoryPropertyNews;
    }
    return (
      <View style={{ flex: 1 }}>
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
          navigation={this.props.navigation}
        />
        {/* <StatusBarBackground lightContent={true} style={{backgroundColor:'#275075'}}/> */}
        {/*removed ScrollListView*/}
        <NewsList
          ref={"newslist"}
          style={{ flex: 1 }}
          type={"category"}
          typeData={this.firstData}
          items={data}
          showTopSeparatorLine={true}
          onItemPress={this._handleOnNewsItemPress}
          onLoadMore={this.onLoadMore}
          isEndOfData={this.page >= this.totalPage}
        />

      </View>
    )
  }
}
