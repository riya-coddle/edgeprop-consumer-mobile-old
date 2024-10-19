  import React, { Component } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    ScrollView,
    Modal,
    Linking,
    NetInfo,
    Dimensions,
    ImageBackground,
    AsyncStorage,
    TouchableOpacity,
} from 'react-native'
import firebase from 'react-native-firebase';
//import type { RemoteMessage } from 'react-native-firebase';
//import { Crashlytics } from 'react-native-fabric'
import StatusBarBackground from '../../components/Common_iOSStatusBar/Common_iOSStatusBar'
import HeaderSearch from '../../components/Common_HeaderSearch/Common_HeaderSearch'
import Home_List from '../../components/Home_List/Home_List'
import LandingHighlight from '../../components/Common_LandingHighlight/Common_LandingHighlight.js'
import IconMenu from '../../components/Common_IconMenu/Common_IconMenu.js'
import Common_MenuList from '../../components/Common_MenuList/Common_MenuList'
import Common_Menu from '../../components/Common_Menu/Common_Menu'
import dataMenu from '../../assets/json/menu.json'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import HomeActions from '../../realm/actions/HomeActions'
import MigrationActions from '../../realm/actions/MigrationActions'
import Loading from '../../components/Common_Loading/Common_Loading'
import AppStateChange from '../../components/AppStateChange/AppStateChange'
import appsFlyer from 'react-native-appsflyer';
//import AppLovin from '../../components/AppLovin/AppLovin';
import TenureOptions from '../../assets/json/Search_Data/TenureOptions.json'
import EditorNews from '../../components/Listing_EditorNews/EditorNews'
import HomeFeaturedProjects from '../../components/Home_FeaturedProjects/HomeFeaturedProjects'
import styles from './HomeLandingStyle.js'


const HOSTNAME = "https://www.edgeprop.sg";
const PROXY_URL = "/proxy?url=";
const API_DOMAIN = "https://api.theedgeproperty.com.sg";
const API_GET_MAIN_RECOMMENDED_PROPERTIES = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN + "/propertypicks/list?types=sale&multiimg=true&moreinfo=true");
const API_GET_MAIN_NEW_PROJECTS = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN + "/newlaunches/list?category=any&limit=5&forcerandom=false"); //temporary hide upon bernard request
const API_GET_MAIN_BELOW_VALUATION_PROPERTIES = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN + "/propertypicks/list?types=sale&multiimg=true&moreinfo=true&deals=true");
const API_GET_GETSHORTLISTS  = 'https://alice.edgeprop.my/api/user/v1/shortlist-get';
const TIMEOUT = 1000;
const API_NEW_LAUNCH = "https://www.edgeprop.my/jwdsonic/api/v1/property/featured-listings/5"
//JSON url
const API_NEW = "https://alice.edgeprop.my/api/v1/view/home/2k18";
const API_SAVED_SEARCH = "https://alice.edgeprop.my/api/user/v1/get-saved-search";
const menuList = [
  { label : 'Sale' , image: '../../assets/images/sale_img.png'},
  { label : 'News Launch' , image: '../../assets/images/news_launch.png'},
  { label : 'Rent' , image: '../../assets/images/rent_img.png'},
  { label : 'News' , image: '../../assets/images/news.png'},
];

class HomeLanding extends Component {
    constructor(props) {
        super(props);
        this.navigation = props.navigation
        this.MigrationActions = new MigrationActions()
        this.MigrationActions.MigrateSchema();
        this.HomeActions = new HomeActions()
        this.choosenType = 'sale';
        this.state = {
            mainNewProjects: [], //temporary hide upon bernard request
            //mainRecommendedProperties: this.HomeActions.GetRecommendedProperties(),
            //mainBelowValuationProperties: this.HomeActions.GetBelowValuationProperties(),
            isFocused: true,
            newLaunches: [],
            sale: [], // this.HomeActions.GetNewSaleProperties(),
            rent: [], //this.HomeActions.GetNewRentProperties(),
            savedSearches: [],
            pullout: [],
            shortlistitems:[],
            onLoading: false
        }

        this.iconClose = require('../../assets/icons/Close.png');
        this._handleFirstConnectivityChange = this._handleFirstConnectivityChange.bind(this);
        this._callAPI = this._callAPI.bind(this);
        this._sendAPIRequest = this._sendAPIRequest.bind(this);
        this._handleOnPressHeaderSearch = this._handleOnPressHeaderSearch.bind(this);
        this._handleOnHighlightPress = this._handleOnHighlightPress.bind(this);
        this._handleMenuButton = this._handleMenuButton.bind(this);
        this._handleOnPressHomeListItem = this._handleOnPressHomeListItem.bind(this)
        this._handleOpenNewLaunches = this._handleOpenNewLaunches.bind(this)
        this._handleOpenFeaturedProjects = this._handleOpenFeaturedProjects.bind(this)
        this._handleOpenRental = this._handleOpenRental.bind(this)
        this._handleOnNewsItemPress = this._handleOnNewsItemPress.bind(this)
        this._handleOnPressFeatured = this._handleOnPressFeatured.bind(this)
        this._handleOpenSale = this._handleOpenSale.bind(this)
        this._getType = this._getType.bind(this)
        this._searchResult = this._searchResult.bind(this)
        this.doNothing = this.doNothing.bind(this)
        this.mySavedSearch = this.mySavedSearch.bind(this)
        this.refresh = this.refresh.bind();
        this.goToListing = this.goToListing.bind(this);
        this._typeFormat = this._typeFormat.bind(this)
        this._handlePullOut = this._handlePullOut.bind(this);
        this._onNewLaunchesPress = this._onNewLaunchesPress.bind(this)
        this._handleHeaderDropdown = this._handleHeaderDropdown.bind(this)
        this._formatNews = this._formatNews.bind(this)
        this.shortListData = this.shortListData.bind(this)
        this._handleOpenShortlist = this._handleOpenShortlist.bind(this)
        this.handleOpenURL = this.handleOpenURL.bind(this)
        this.navigateDeep = this.navigateDeep.bind(this)
    }

    async componentWillReceiveProps(nextProps) {
      await this.resetUsrInfo();
      if(this.state.userInfo.uid == 0) {
        this.setState({
            savedSearches: [],
            shortlistitems:[]
        })
      }

    }

    async resetUsrInfo() {
        const user = await AsyncStorage.getItem("authUser");  
        if(user && user != '') {
            let authItems = JSON.parse(user);
            if(authItems.status == 1) {

                this.setState({ userInfo: authItems })
            }
        }   
    }


    shouldComponentUpdate(nextProps, nextState) {
      
      if(JSON.stringify(nextState.sale) != JSON.stringify(this.state.sale)){
        this.HomeActions.CreateNewSaleProperties(nextState.sale);
        return true;
      }
      if(JSON.stringify(nextState.rent) != JSON.stringify(this.state.rent)){
        this.HomeActions.CreateNewRentProperties(nextState.rent);
        return true;
      }
      return JSON.stringify(nextState) !== JSON.stringify(this.state)
    }

    _onNewLaunchesPress() {
        this.refs.navigationHelper._navigate('PropMall', {
            data: {}
        })      
    }    

    navigateDeep = (url) => { 
      const route = url.replace(/.*?:\/\//g, '');
      let params = {}
      const routeName = route.split('/')[0];
      let data = {};
      let path = "";
      if (routeName === 'news') {
        let id = route.match(/\/([^\/]+)\/?$/)[1];
        data = {
          nid: id,
          url: ''
        }
        path = "NewsDetail";
      }else if (routeName === 'property' || routeName === 'propmall') {
        let urlParts = route.split('/');
        let key = urlParts[1];
        let type = urlParts[2];
        let propertyId = urlParts[3];
        if(urlParts.length >= 5) {
          var agentId = urlParts[4];
        }
        if (routeName === 'property') {
          data = {
            area: "",
            askingPrice: "",
            itemId: 0,
            key: key,
            lan: 0,
            lat: 0,
            listing_type: type,
            newLaunch: 0,
            nid: propertyId,
            project: "",
            property_id: propertyId,
            shortlisted: false,
            state: "",
            uid: agentId
          }
          path = "ListingDetailNav";
        }else if (routeName === 'propmall') {
          data =  {
            property_id: propertyId,
            listing_type: type,
            key: key,
            uid: 0,
            nid: propertyId,
            lat: 0,
            lan: 0,
            state:'',
            area: '',
            project: '',
            shortlisted: false,
            itemId: 0
          }
          path = "PropMallDetail";
        }        

      }

      if(path != '') {
        this.refs.navigationHelper._navigate(path, {
            data: data,
            onGoBack: (path != 'NewsDetail')?this.doNothing:''
        })
      }
      
    }

    handleOpenURL = (event) => {
      this.navigateDeep(event.url);
    }

    async componentDidMount() {
      Linking.getInitialURL().then(url => {
        if(global.deepLink == null && url == null) {
          global.deepLink = "Added";
          Linking.addEventListener('url', this.handleOpenURL);
        }
        if (global.deepLink == null && url != null) {
            global.deepLink = "Added";
            Linking.addEventListener('url', this.handleOpenURL);
            this.navigateDeep(url);
        }
      });
      //this._callAPI(API_GET_MAIN_NEW_PROJECTS, "mainNewProjects"); //temporary hide upon bernard request
     // AppLovin.initialize();
      // AppLovin.createInterstitialAd(); //uncomment this to see the ads
      //this._callAPI(API_GET_MAIN_RECOMMENDED_PROPERTIES, "mainRecommendedProperties");
      //this._callAPI(API_GET_MAIN_BELOW_VALUATION_PROPERTIES, "mainBelowValuationProperties");
      const auth = await AsyncStorage.getItem("authUser");
      if(auth && auth != '') {
        let authItems = JSON.parse(auth);
        if(authItems.status == 1) {
          this.setState({ userInfo: authItems, itemLoaded: true })
        }
        //console.log('userInfo', this.state.userInfo);
      }

      this._callAPI(API_NEW, "salesandRent");
      this.shortListData();
      //this._callAPI(API_NEW_LAUNCH, "featureProjects");
      //this._callAPI(API_SAVED_SEARCH, "savedSearches");

     // this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
        // Process your message as required
        //Alert.alert('masuk sini gan')

      //  });
        const options = {
            devKey: "YbGDQzZyrcvXUTdRreU5ga",
            isDebug: true
        };

        if (Platform.OS === 'ios') {
            options.appId = "1069299307";
        }

        appsFlyer.initSdk(options,
        (result) => {
            console.log(result, options);
        },
        (error) => {
            console.error(error);
        }
        )
      }
    componentWillUnmount() {
      Linking.removeEventListener('url', this.handleOpenURL);
      // this.messageListener();
    }

    _handlePullOut(item){
      //console.log('item', item);

      /*this.refs.navigationHelper._navigate('PullOut', {
            data: {
                item: item
            },
            onGoBack: this.doNothing
        })*/

      Linking.openURL(item.pullout)
    }

    _getType(id) {
      //console.log("id",id);
      let propertyType = [
        {
            "label": "All Types",
            "value": ""
        },
        {
            "label": "All Residential",
            "value": "rl"
        },
        {
            "label": "Residential (landed only)",
            "value": "l-36"
        },
        {
            "label": "All Non Landed",
            "value": "r-33"
        },
        {
            "label": "Commercial",
            "value": "c-60"
        },
        {
            "label": "Industrial",
            "value": "i-70"
        },
      ];

      var result = propertyType.map((item, i) => {
        if (item.value == id) {
          return (item.label);
        }
      });
      

      result = result.filter(function( element ) {
         return element !== undefined;
      });
      //console.log("result1",result);

      if (result != undefined) {
        return result;
      } else {
        return "";
      }
    }

    groupBy(xs, key) {
        return xs.reduce((rv, x) => {
          // eslint-disable-next-line no-param-reassign
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };

    shortListData() {
      this.setState({ onLoading : true, groupItems: [] })
      fetch(API_GET_GETSHORTLISTS, {
        method: 'POST',
        headers: new Headers({
                 'Accept' : 'application/json',
                 'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        }),
        body: "uid="+this.state.userInfo.uid
      }).then((response) => response.json())
      .then((responseText) => {
        if (responseText.hasOwnProperty('data')) {
          //console.log('shortlistitems', responseText.data);
          this._formatResult(responseText.data,'shortlistitems');         
        }
      })
      .catch((error) => {
          console.error(error);
      }); 
    }

     _typeFormat(type, params) {
    //console.log("type,params",type, params)
      let itemList = '';
      type = params.listing_type?params.listing_type:''
      if(params.state != undefined && params.state != '') {
        itemList += params.state?'State: '+params.state+',':'Kuala Lumpur '+' '
      }
      if(!params.state) {
        itemList +=  'State:  Kuala Lumpur '
      }
      if(type) {
        if(type == 'sale' ) {
          itemList += ' Buy, '  
        }else if(type == 'rent' || type == 'rental') {
          itemList += ' Rent, '
        } else if (type == 'new_launch') {
           itemList += ' New Launch,' 
        }else {
          itemList += type.charAt(0).toUpperCase() + type.slice(1) + ', ';
        }
      }
      
      if(params.property_type != undefined && params.property_type != '') {
        itemList += params.property_type? this._getType(params.property_type) + ', ' : ''
      }

      if(params.asking_price_min != undefined && params.asking_price_min != '') {
        itemList += params.asking_price_min ? ' Min Price: '+this._formatMoney(params.asking_price_min)+' sqft, ' : ''
      }

      if(params.beds != undefined && params.beds != '') {
        itemList += params.beds  != "0"?'Beds: '+params.beds + ', ':' Studio '
      }
      if(params.build_up_max != undefined && params.build_up_max != '') {
        itemList += 'Buildup Max: '+params.build_up_max+' sqft, '
      }
      if(params.build_up_min != undefined && params.build_up_min != '') {
        itemList += 'Buildup Min: '+params.build_up_min+' sqft, '
      }
      if(params.keyword != undefined && params.keyword != '') {
        itemList += params.keyword+','
      }
     // console.log(itemList.replace(/(^[,\s]+)|([,\s]+$)/g, ''))
      return itemList.replace(/(^[,\s]+)|([,\s]+$)/g, '');
    }

    _searchResult(searchParam, searchName, propertyType){
    var items = {};
    var parts = propertyType.apiparams.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
          items[key] = value;
      });
   // console.log('parts',items)
        this.refs.navigationHelper._navigate('ExploreLanding', {
            data: {
              state: searchParam.state != undefined ? searchParam.state: '',
              // district: searchParam.district != undefined ? searchParam.district: '',
              // keyword: searchParam.keyword != undefined ? searchParam.keyword: searchName,
              // property_type: searchParam.propertyType != undefined ? searchParam.propertyType: '',
              listing_type: items.listing_type?(items.new_launch?(items.new_launch==1?'new_launch':items.listing_type):items.listing_type):'sale',
              //state: items.state?items.state:'Kuala Lumpur',
              bedroom_min: items.beds?items.beds:'',
              asking_price_min: items.asking_price_min?Number(items.asking_price_min):{},
              asking_price_max: items.asking_price_max?Number(items.asking_price_max):{},
              build_up_min: items.build_up_min?Number(items.build_up_min):{},
              build_up_max: items.build_up_max?Number(items.build_up_max):{},
              land_area_min: items.land_area_min?Number(items.land_area_min):{},
              land_area_max: items.land_area_max?Number(items.land_area_max):{},
              furnishing: items.furnished?items.furnished:'',
              rental_type: items.property_type?items.property_type:'rl',
              keyword: items.keyword?items.keyword:'',
              asset_id: items.asset_id?items.asset_id:'',
              new_launch: items.new_launch?1:0,  
            }
        })
    }
    _handleFirstConnectivityChange(isConnected, apiUrl, stateName) {
      if (isConnected) {
         this._sendAPIRequest(apiUrl, stateName);
      }
      this._handleFirstConnectivityChange(true, apiUrl, stateName)
      //NetInfo.isConnected.removeEventListener('connectionChange', (isConnected)=>);
    }

    _callAPI(apiUrl, stateName) {
      this._sendAPIRequest(apiUrl, stateName);
     /* if (Platform.OS === 'ios') {
        this._handleFirstConnectivityChange(true, apiUrl, stateName)
        //NetInfo.isConnected.addEventListener('connectionChange', (isConnected)=>this._handleFirstConnectivityChange(true, apiUrl, stateName));
      }
      else {
        NetInfo.isConnected.fetch().then(isConnected => {
          if (isConnected) {
             
          }
        });
      } */
    }
    
    mySavedSearch() {
      this.refs.navigationHelper._navigateInMenu("MySavedSearch", {
        data: this.state.userInfo,
        onGoBack: this.refresh
       })
    }

    refresh = (item) => {
      this._callAPI(API_NEW, "salesandRent");
      this.shortListData();
    }

    _sendAPIRequest(apiUrl, stateName){
//Alert.alert(apiUrl)
      if (stateName == 'savedSearches') {
        fetch(apiUrl, {
          method: 'POST',
          headers: new Headers({
                   'Accept' : 'application/json',
                   'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
          }),
          body: "uid="+this.state.userInfo.uid // <-- Post parameters        })
        }).then((response) => response.json())
          .then((responseText) => {
            let dataArray = [];

            if (responseText.status != undefined && responseText.status == 1) {
              for (i=0 ; i < responseText.data.length; i++) {
                dataArray[i] = responseText.data[i];
                if (i == 2) {
                  break;
                }
              }
              this.setState({ savedSearches: dataArray });
            } else {
              this.setState({ savedSearches: [] })
            }
          })
        .catch((error) => {
            console.error(error);
        });
      }
      if (!this.state[stateName] && stateName != 'savedSearches') {
          fetch(apiUrl,
          {
              method: 'GET', timeout: TIMEOUT
          }).
          then((response) => response.json()).
          then((responseJson) => {

              if (responseJson && stateName == 'salesandRent') {
                  //console.log('response', responseJson);
                  let maxsale = responseJson.sale;
                  let maxrent = responseJson.rent;
                  this._formatResult(maxsale,'sale');
                  this._formatResult(maxrent,'rent');
                  let newsList = this._formatNews(responseJson.news.news);

                  this.setState({
                    mainNewProjects : newsList,
                    pullout: responseJson.pullout,
                    newLaunches: responseJson.newlaunch ? (responseJson.newlaunch.property? responseJson.newlaunch.property : [] ): []
                  })
                  
              } 
              this._sendAPIRequest(API_SAVED_SEARCH, "savedSearches");
              if (responseJson && stateName == 'featureProjects') {
                    this.setState({
                      newLaunches : responseJson.property
                    })
              } 
          })
          .catch((error) => {
              console.log(error);
          });
      }
    }

    doNothing() {

    }

    _handleOnPressFeatured(item, index) {
      firebase.analytics().logEvent('View_Listing', { id: item.listing_id });
        const eventName = "View_Listing";
        const eventValues = {
        };
        appsFlyer.trackEvent(eventName, eventValues,
            (result) => {
                console.log(result);
            },
            (error) => {
                console.error(error);
            }
        )
        let mapData = item.location_p?item.location_p.split(/\s*,\s*/):'';

        this.refs.navigationHelper._navigate('PropMallDetail', {
            data: {
                property_id: (item.nid_i && item.nid_i >0)? item.nid_i: item.mid_i,
                listing_type: item.type_s == 'rent'?'rental':item.type_s,
                key: (item.nid_i && item.nid_i >0)? 'n': 'm',
                uid: item.uid_i,
                nid: item.nid_i,
                lat: mapData[0]?mapData[0]:0,
                lan: mapData[1]?mapData[1]:0,
                state: item.state_s_lower?item.state_s_lower:'',
                area: item.district_s_lower?item.district_s_lower:'',
                project: item.title_t?item.title_t:'',
                shortlisted: item.shortlist?true: false,
                itemId: item.id?item.id:0,
                newLaunch:0
            },
            onGoBack: this.doNothing
        })
    }

    _formatResult(result,stateName){
      //console.log(stateName, result);
        let response = [];
        for (var index = 0; index < result.length; index++) {
            let data = result[index];
            let item = {};
            if(stateName == 'shortlistitems') {
              item.images = data.images?data.images:[];
            }else {
              let images = data.field_prop_images? (data.field_prop_images.und? data.field_prop_images.und: []) :[];
              item.images = [];
              images.map((img, index) => {
                  if(img.list_uri){
                      item.images.push(img.list_uri);
                  }
              });
            }
            
            if(item.images.length == 0) {
              item.images.push('https://dkc9trqgco1sw.cloudfront.net/s3fs-public/default_images/no_img.png')
            }
            if(data.field_property_type) {
             if(data.field_property_type.und ) {
                  if(data.field_property_type.und[0] && data.field_property_type.und[0].target_id == 36) {
                    if(data.field_prop_land_area) {
                      if(data.field_prop_land_area.und && data.field_prop_land_area.und[0].value != undefined ) {
                        item.total_sqft = data.field_prop_land_area? (data.field_prop_land_area.und? (data.field_prop_land_area.und[0]? data.field_prop_land_area.und[0].value: 0): 0) : 0;    
                        item.perSqft    = data.field_prop_price_pu? (data.field_prop_price_pu.und? (data.field_prop_price_pu.und[0]? data.field_prop_price_pu.und[0].value: 0): 0) : 0;
                      }
                    }
                    if(data.field_prop_built_up_sqft) { 
                      if(data.field_prop_built_up_sqft.und && data.field_prop_built_up.und[0].value != undefined) {
                       item.total_sqft = data.field_prop_built_up? (data.field_prop_built_up.und? (data.field_prop_built_up.und[0]? data.field_prop_built_up.und[0].value: 0): 0) : 0;   
                       item.perSqft    = data.field_prop_built_up_price_pu? (data.field_prop_built_up_price_pu.und? (data.field_prop_built_up_price_pu.und[0]? data.field_prop_built_up_price_pu.und[0].value: 0): 0) : 0; 
                      }
                    }
                  }
                if(data.field_property_type.und[0] && data.field_property_type.und[0].target_id != 36) {
                  if(data.field_prop_built_up_sqft) { 
                   if(data.field_prop_built_up_sqft.und && data.field_prop_built_up.und[0].value != undefined) {
                     item.total_sqft = data.field_prop_built_up? (data.field_prop_built_up.und? (data.field_prop_built_up.und[0]? data.field_prop_built_up.und[0].value: 0): 0) : 0;   
                     item.perSqft    = data.field_prop_built_up_price_pu? (data.field_prop_built_up_price_pu.und? (data.field_prop_built_up_price_pu.und[0]? data.field_prop_built_up_price_pu.und[0].value: 0): 0) : 0;
                    }
                  }
                  if(data.field_prop_land_area) {   
                    if(data.field_prop_land_area.und && data.field_prop_land_area.und[0].value != undefined ) {
                      item.total_sqft = data.field_prop_land_area? (data.field_prop_land_area.und? (data.field_prop_land_area.und[0]? data.field_prop_land_area.und[0].value: 0): 0) : 0;    
                      item.perSqft    = data.field_prop_price_pu? (data.field_prop_price_pu.und? (data.field_prop_price_pu.und[0]? data.field_prop_price_pu.und[0].value: 0): 0) : 0;
                    }
                  }   
                }   
              } 
            } 
            item.title = data.title;
            item.nid = data.nid?data.nid:0;
            item.mid = data.mid?data.mid:0;
            
           // item.street = data.field_prop_street? (data.field_prop_street.und? (data.field_prop_street.und[0]? data.field_prop_street.und[0].value: '') : '') : '';
          //  item.tenure = this._tenureValue(data.field_prop_lease_term)
          //  item.postcode = data.field_prop_postcode? (data.field_prop_postcode.und? (data.field_prop_postcode.und[0]? data.field_prop_postcode.und[0].value: '') : '') : '';
          //  item.year_completed = data.field_completion_year? (data.field_completion_year.und? (data.field_completion_year.und[0]? (data.field_completion_year.und[0].value): ''): '') : '';
          //  item.land_area = data.field_prop_land_area? (data.field_prop_land_area.und? (data.field_prop_land_area.und[0]? data.field_prop_land_area.und[0].value: '') : '') : '';
          //  if(item.land_area)
          //      item.land_area = item.land_area.toString();
            item.property_id = (data.nid && data.nid >0)? data.nid: data.mid;
            if(stateName == 'shortlistitems') {
              item.listing_type = data.type?data.type:'';
              item.asking_price = data.price?this._formatMoney(data.price):0;
              item.bedrooms = data.bed?data.bed:0;
              item.bathrooms = data.bath?data.bath:0;
              item.uid = data.uid_i?data.uid_i:0;
              item.total_sqft = data.list_area?data.list_area:0;
              item.perSqft = data.list_area_pu?data.list_area_pu:0;
              item.s_id = data.s_id?data.s_id:false;
            }else {
              item.listing_type = data.field_prop_listing_type.und[0].value;
              item.asking_price = data.field_prop_asking_price? (data.field_prop_asking_price.und? (data.field_prop_asking_price.und[0]? this._formatMoney(data.field_prop_asking_price.und[0].value): ''): '') : '';
              item.bedrooms = data.field_prop_bedrooms? (data.field_prop_bedrooms.und? (data.field_prop_bedrooms.und[0]? data.field_prop_bedrooms.und[0].value: -1): -1) : -1;
              item.bathrooms = data.field_prop_bathrooms? (data.field_prop_bathrooms.und? (data.field_prop_bathrooms.und[0]? data.field_prop_bathrooms.und[0].value: 0): 0) : 0;
              item.uid = data.uid;
            }
            item.perSqft = !isNaN(item.perSqft)? Math.round(Number(item.perSqft)) : item.perSqft;
            item.key = (data.nid && data.nid >0)? 'n': 'm';
            item.district = data.district ? data.district : '';

            response.push(item);
        }
        //console.log(stateName, response);
        this.setState({
            [stateName]: response
        });
    }

    _formatNews(result,stateName){
      //console.log(stateName, result);
        let response = [];
        for (var index = 0; index < result.length; index++) {
            let data = result[index];
            let item = {};

            item.title = data.title;
            item.publishdate_react = data.publishdate?data.publishdate:'';
            item.nid = data.nid?data.nid:'';
            item.realnid = data.realnid?data.realnid:'';
            item.publishdate = data.created?data.created:'';
            item.image = data.image?data.image:'';
            item.image_original = data.image?data.image:'';
            item.url = data.url?data.url:'';
            item.desc = data.desc?data.desc:'';

            response.push(item);
        }
        //console.log(stateName, response);
        return response;
    }

    _formatNumber(num) {
        if(num) {
          return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        }
    }

    _formatMoney(val) {
        return val ? 'RM ' + this._formatNumber(val) : '-'
    }

    _tenureValue(data){
        let value = data.und? (data.und[0]? data.und[0].value: ''): '';
        let tenure = TenureOptions.filter(tenure => tenure.id == value);
        return tenure[0]? tenure[0].value: '';
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


    _handleOnPressHeaderSearch() {
        // Alert.alert("Comming Soon", `Common HeaderSearch Touched, this feature will be coming soon`);
        this.refs.navigationHelper._navigateInMenu("PropertySearchMenu", {
         data: {
          hintText: '',
          proprtyType: this.choosenType
         },
         onGoHome: this.refresh
       })
    }

    _handleHeaderDropdown(val){
      if(val == 'Buy'){
        val = 'sale'
      }else if(val == 'Rent'){
        val = 'rental'
      }
      this.choosenType = val;
    }

    _handleOnHighlightPress(item) {
        //let url = 'https://www.edgeprop.sg' + item.url
        //this._directToBrowser(url)
        let url = item.url

        this.refs.navigationHelper._navigate('NewsDetail', {
            data: {
                url: url,
                nid: item.realnid
            }
        })
    }

    goToListing(link) {

      if (link == 'buy') {
        this._handleOpenSale();  
      }
      if (link == 'rent') {
        this._handleOpenRental();
      }
      if (link == 'news') {
        this._handleOpenNewLaunches();
      }
      if (link == 'new_launch') {
        this.refs.navigationHelper._navigate('ExploreLanding', {
          data: {
            listing_type: 'new_launch',
            from: 'home'
          }
        });
      }
    }

    _handleOpenSale() {

      this.refs.navigationHelper._navigate('ExploreLanding', {
          data: {
            listing_type: 'sale',
            from: 'home'
          }
        })
    }

    _handleOpenShortlist() {
      this.refs.navigationHelper._navigateInMenu("MyShortLists", {
        data: this.state.userInfo,
         onGoBack: this.refresh
       })
    }

    _handleOpenRental() {

      this.refs.navigationHelper._navigate('ExploreLanding', {
          data: {
            listing_type: 'rental',
            from: 'home'
          }
        })
    }

    _handleMenuButton() {
        this.refs.menu._toggleMenu()
    }

    _handleOnPressHomeListItem(item, index) {
        // only for fabric testing, can delete it, if done with it
        // Crashlytics.crash()
        // if (Platform.OS==='ios') Crashlytics.recordError('iOS test2')
        // if (Platform.OS==='android') Crashlytics.logException('android test2')

        firebase.analytics().logEvent('View_Listing', { id: item.nid });

        const eventName = "View_Listing";
        const eventValues = {
        };

        appsFlyer.trackEvent(eventName, eventValues,
            (result) => {
                console.log(result);
            },
            (error) => {
                console.error(error);
            }
        )
         
        this.refs.navigationHelper._navigate('ListingDetailNav', {
            data: {
                property_id: item.property_id,
                listing_type:item.listing_type == 'rent'?'rental':item.listing_type,
                key: item.key,
                uid: item.uid,
                nid: item.nid,
                lat: item.field_geo_lat_lng? (item.field_geo_lat_lng.und? (item.field_geo_lat_lng.und[0]? item.field_geo_lat_lng.und[0].lat: 0): 0) : 0,
                lan: item.field_geo_lat_lng? (item.field_geo_lat_lng.und? (item.field_geo_lat_lng.und[0]? item.field_geo_lat_lng.und[0].lng: 0): 0) : 0,
                state: '',
                area: item.district?item.district:'',
                project: '',
                shortlisted: item.s_id?true: false,
                itemId: item.id?item.id:0,
                newLaunch:0,
                askingPrice: item.asking_price
            },
            onGoBack: this.doNothing
        })
    }

    _handleOnNewsItemPress(item,index) {
        var length = 99;
        var trimmedTitle = item.title.length > length ?
                    item.title.substring(0, length - 3) + "..." :
                    item.title;

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
                url: item.url,
                nid: item.realnid,
                isHomePage: true
            }
        })
    }

    _handleOpenNewLaunches(){

      this.refs.navigationHelper._navigate('NewsLanding', {
          data: {
            category: 'news'
          }
        })
    }

    _handleOpenFeaturedProjects(){
      this.refs.navigationHelper._navigate('PropMall');
    }

    render() {

     // console.log('dsfkdsfg gfj dflgj dflg dflg df', this.props.navigation.state);
      var icon = require('../../assets/icons/menu_more.png');
      var {height, width} = Dimensions.get('window')
      var today = new Date()
      var curHr = today.getHours()
      let messageText = ''; 
      if (curHr < 12) {
        messageText = 'morning';
      } else if (curHr < 18) {
        messageText = 'afternoon';
      } else {
        messageText = 'evening';
      }

      return (

          <View style={{ flex: 1 }}>
              <NavigationHelper
                    ref={"navigationHelper"}
                    navigation={this.props.navigation} />
              <AppStateChange/>
              
              <View style={{ flex: 1 }}>
                  <View style={{flex:1}}>
                    <ScrollView>
                      <View style={{flex:1}}>
                      <ImageBackground 
                          source={require('../../assets/images/banner.png')}
                          style={{width: width , height: width * 0.65 }} >
                        <View style={{ flex: 1 }}>
                          <HeaderSearch
                            ref={'headerSearch'}
                            hintText={'Start a search'}
                            editable={true}
                            fontSize={width * 0.04}
                            showIconSearch={true}
                            isHomePage={true}
                            needsEdit={false}
                            isProperty={false}
                            onPress={this._handleOnPressHeaderSearch}
                            onDropdownToggle={this._handleHeaderDropdown}
                          />
                        </View>
                      </ImageBackground>  
                      </View>
                      <View style={styles.hpMainContainer}>
                        <View style={styles.hpFirstSec}>
                          <Text allowFontScaling={false}
                            style={styles.bannerTitle}
                          >Good {messageText}, what can we help you with?
                          </Text>

                          <View style={styles.menuSectionTop}>
                            <TouchableOpacity style={styles.menuContainer} onPress={() => this.goToListing('buy')}>
                              <View >
                                <View style={styles.menuCard}>
                                  <View>
                                    <Image 
                                        source={require('../../assets/images/sale_img.png')}
                                        style={styles.menuImages} 
                                    />
                                  </View>
                                
                                  <View>
                                    <Text allowFontScaling={false} style={styles.labelText}>Buy</Text>
                                  </View>
                                </View>
                              </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuContainer} onPress={() => this._onNewLaunchesPress()}>

                              <View >
                                <View style={styles.menuCard}>
                                  <View>
                                    <Image 
                                        source={require('../../assets/images/news_launch.png')}
                                        style={styles.menuImages} 
                                    />
                                  </View>
                                  
                                  <View>
                                    <Text allowFontScaling={false} style={styles.labelText}>New Launch</Text>
                                  </View>
                                </View>
                              </View>
                            </TouchableOpacity>
                          </View>
                            
                          <View style={styles.menuSectionTop}>                        
                            <TouchableOpacity style={styles.menuContainer} onPress={() => this.goToListing('rent')}>
                              <View >
                                <View style={styles.menuCard}>
                                  <View>
                                    <Image 
                                      source={require('../../assets/images/rent_img.png')}
                                      style={styles.menuImages} 
                                    />
                                  </View>
                                  
                                  <View>
                                    <Text allowFontScaling={false} style={styles.labelText}>Rent</Text>
                                  </View>
                                </View>
                              </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuContainer} onPress={() => this.goToListing('news')}>
                              <View >
                                <View style={styles.menuCard}>
                                  <View>
                                    <Image 
                                        source={require('../../assets/images/news.png')}
                                        style={styles.menuImages} 
                                    />
                                  </View>
                                  <View>
                                    <Text allowFontScaling={false} style={styles.labelText}>News</Text>
                                  </View>
                                </View>
                              </View>
                            </TouchableOpacity>
                          </View> 
                        </View>
                        {this.state.savedSearches.length > 0 && (
                        <View style={styles.hpFirstSec}>
                          <View style={styles.savedSearches}>
                           <View style={styles.savedSearchesHead}>
                              <Text allowFontScaling={false} style={styles.searchesHeading}>Saved Searches</Text>
                              <TouchableOpacity onPress={this.mySavedSearch}>
                              <Text allowFontScaling={false}
                         style={{
                              fontFamily: 'Poppins-Medium' ,
                              fontSize: width * 0.030,
                              alignItems: 'flex-end',
                              color:'#488BF8'
                          }}>
                          See all
                          </Text>
                          </TouchableOpacity>
                           </View>
                           {this.state.savedSearches.map((item, i) => {
                              return (
                              <View style={[styles.searchesSection, {marginLeft: 0, marginRight: 25}]} key={i}>
                                <TouchableOpacity onPress={() => this._searchResult(item.params, item.name, item)} >
                                  <View style={styles.searchWrapper}>
                                    <View style={styles.searchIconContainer}>
                                      <Image
                                        style={{width: 17, height: 17}}
                                        source={require('../../assets/icons/search-icon.png')}
                                       />
                                    </View>
                                      <View style={styles.searchContentContainer}>
                                       <Text allowFontScaling={false} style={styles.searchesIconHeading}>{item.name}</Text>
                                       <Text allowFontScaling={false} style={styles.searchesIconText}>
                                        {this._typeFormat(item.type,item.params)}
                                        </Text>
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                </View>)
                              })
                            }
                          </View>
                        </View>)}
                        <View style={styles.hpFirstSec}>
                          <EditorNews
                                item={this.state.mainNewProjects}
                                title={'Property News'}
                                tooltip={false}
                                isEditorNews={true}
                                onPressItem={this._handleOnNewsItemPress}
                                moreOption={true}
                                onPressMore={this._handleOpenNewLaunches}
                            />
                        </View>
                        {this.state.newLaunches &&  this.state.newLaunches.length > 0 && (
                        <View style={styles.hpFirstSec}>
                          <HomeFeaturedProjects
                                item={this.state.newLaunches}
                                title={'Featured Projects'}
                                tooltip={false}
                                isEditorNews={false}
                                onPressItem={this._handleOnPressFeatured}
                                onPressMore={this._handleOpenFeaturedProjects}
                                moreOption={true} 
                            />
                        </View>
                        )}
                        <View style={styles.hpFirstSec}>
                          <View style={{paddingLeft: 23 }} >
                            <Home_List
                              item={this.state.sale}
                              title={'Top Picks For Sale'}
                              tooltip={false}
                              moreOption={true}
                              onPressItem={this._handleOnPressHomeListItem}
                              onPressMore={this._handleOpenSale}
                            />
                          </View>
                        </View>
                        <View style={styles.hpFirstSec}>
                          <View style={{paddingLeft: 23 }} >
                            <Home_List
                              item={this.state.rent}
                              title={'Top Picks For Rent'}
                              tooltip={false}
                              moreOption={true}
                              onPressItem={this._handleOnPressHomeListItem}
                              onPressMore={this._handleOpenRental}
                            />
                          </View>
                        </View>
                      {this.state.shortlistitems &&  this.state.shortlistitems.length > 0 && (
                        <View style={styles.hpFirstSec}>
                          <View style={{paddingLeft: 23 }} >
                            <Home_List
                              item={this.state.shortlistitems}
                              title={'Shortlisted Properties'}
                              tooltip={false}
                              moreOption={true}
                              onPressItem={this._handleOnPressHomeListItem}
                              onPressMore={this._handleOpenShortlist}
                            />
                          </View>
                        </View>
                        )}
                      </View>

                      {this.state.pullout.length > 0 && (<View style={styles.pulloutSliderSection}>
                        <Text allowFontScaling={false} style={styles.PulloutTitle}>Latest Pullouts</Text>
                        <ScrollView horizontal={true} bounces={false}>
                          {this.state.pullout.map((item, i) => {
                            return (
                            <TouchableOpacity 
                              onPress={()=> this._handlePullOut(item)}
                              style={styles.pulloutSingleItem} key={i}>
                              <ImageBackground
                                source={{ uri: item.cover }}
                                resizeMode= 'cover'
                                style={styles.pulloutImage}>
                              </ImageBackground>
                            </TouchableOpacity>)
                            })
                          }
                        </ScrollView>
                      </View>)}
                      {/*<View style={{ paddingTop: 35 }} /> */}   
                    </ScrollView>
                    {(this.state.mainNewProjects.length==0&&this.state.sale.length==0&&this.state.rent.length==0)?
                      <Loading/>:
                      <View/>
                    }
                  </View>
              </View>
          </View>
          )
    }
}

export default HomeLanding
