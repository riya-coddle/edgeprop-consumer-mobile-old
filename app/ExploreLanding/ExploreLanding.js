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
    PixelRatio,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    AsyncStorage,
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
import BookmarkHelper from '../../components/Common_BookmarkHelper/Common_BookmarkHelper.js'
import ListingResultList from '../../components/ListingResult_List/ListingResult_List'
import { Dropdown } from 'react-native-material-dropdown';
import SaveSearch from '../../app/SavedSearchModal/SavedSearchModal';
import styles from './ExploreLandingStyle.js'

const {width, height} = Dimensions.get('window');

const PROXY_URL = "/proxy?url=";
const API_DOMAIN = "?";
const HOSTNAME = "https://www.edgeprop.my/jwdsonic/api/v1/property/search";
const TIMEOUT = 1000;
const API_GET_LISTING_RESULT = HOSTNAME;
const PAGE_SIZE = 10;
const filter = [
  { label: 'Relevance' , value: 'relevance' },
  { label: 'Latest First' , value: 'posted_desc' },
  { label: 'Price Low to High' , value: 'price_asc' },
  { label: 'Price High to Low' , value: 'price_desc' }
];
//JSON url
const API_NEW = "https://alice.edgeprop.my/api/v1/view/home/2k18";

class ExploreLanding extends Component {
    constructor(props) {
        super(props);
        this.navigation = props.navigation
        this.state = {
            listingResult: [],
            bookmarkList: [],
            filterChange: false,            
            sortBy: filter[0].value,
            flagState: false,
            toggleLoader: false,
            //listingType: (this.navigation && this.navigation.state.params && this.navigation.state.params.data && this.navigation.state.params.data.listing_type?this.navigation.state.params.data.listing_type:'sale'),
            showModal: false,
            userInfo: {},
            saveParams: '',
            noItems: false,
            // Search data
        }
   //console.log('this.props.navigation',this.props.navigation);
        //console.log('constructor');
        this.iconClose = require('../../assets/icons/Close.png');
        this._handleFirstConnectivityChange = this._handleFirstConnectivityChange.bind(this);
        this._callAPI = this._callAPI.bind(this);
        this._sendAPIRequest = this._sendAPIRequest.bind(this);
        this._handleOnPressHeaderSearch = this._handleOnPressHeaderSearch.bind(this);
        this._handleMenuButton = this._handleMenuButton.bind(this);
        this._handleLoadMore = this._handleLoadMore.bind(this);
        this._handleParamSearchOption = this._handleParamSearchOption.bind(this);
        this._handleOnPressListing = this._handleOnPressListing.bind(this);
        this._handlerOnPressSearch = this._handlerOnPressSearch.bind(this);
        this._handleFilter = this._handleFilter.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onPressBack = this.onPressBack.bind(this)
        this.onCloseClick = this.onCloseClick.bind(this);
        this._handleSavedSearch = this._handleSavedSearch.bind(this)
        this._handleTypeChange = this._handleTypeChange.bind(this)
        this._setParams = this._setParams.bind(this)
        this._hanldeSearchParamItems = this._hanldeSearchParamItems.bind(this)
        this.isObejctCheck = this.isObejctCheck.bind(this)
        this._handleNoData = this._handleNoData.bind(this)
        this._handleOpenFeaturedProjects = this._handleOpenFeaturedProjects.bind(this)
        this.pageCount = 0;
        this.totalPage = 1;
        this.totalListing = -1;
        this.didMount = false;
        this.orderBy = this.state.sortBy;
        this.sortingValue = 'Relevance';
        this.newLaunch = false
        this.navigation.setParams({
          handleFilter: this._handleFilter,
          handleMap: this._handleMap,
        })
        this._setParams();

    }

    _setParams(items = null) {      
      this.setState({ listingResult : {} , toggleLoader: true })
      this.pageCount = 0;
        this.title = this.props.navigation.state.params.data?(this.props.navigation.state.params.data.title?this.props.navigation.state.params.data.title:(this.props.navigation.state.params.title?this.props.navigation.state.params.title:'searchoption')):'searchoption'
          
          if(items) {
            console.log('items', items)
             this.title = items.title?items.title:this.title
              this.parameterFilter = {
                listing_type: items.data.listing_type?items.data.listing_type:'sale',
                state: items.data.state?items.data.state:(items.state?items.state:'Kuala Lumpur'),
                district: items.data.district?items.data.district:[],
                bedroom_min: items.data.bedroom_min?items.data.bedroom_min:'',
                asking_price_min: items.data.asking_price_min?items.data.asking_price_min:{},
                asking_price_max: items.data.asking_price_max?items.data.asking_price_max:{},
                build_up_min: items.data.build_up_min?items.data.build_up_min:{},
                build_up_max: items.data.build_up_max?items.data.build_up_max:{},
                land_area_min: items.data.land_area_min?items.data.land_area_min:{},
                land_area_max: items.data.land_area_max?items.data.land_area_max:{},
                furnishing: items.data.furnishedType?items.data.furnishedType:'',
                rental_type: items.data.rental_type?items.data.rental_type:'rl',
                keyword: items.data.keyword?items.data.keyword:(items.data?(items.data[0]?items.data[0].value:''):''),
                asset_id: items.data.asset_id?items.data.asset_id:'',
                chosenType: items.data.listing_type?items.data.listing_type:'sale',
                poi_lat: items.data.poi_lat?items.data.poi_lat:'',
                poi_lon: items.data.poi_lon?items.data.poi_lon:'',
                //t: this.props.navigation.state.params.data?(this.props.navigation.state.params.data.t?this.props.navigation.state.params.data.t:''):"",
                new_launch: items.data.new_launch?items.data.new_launch:false,
                stations: items.data.stations?items.data.stations:''
              } 
          } else {
              console.log('navigation', this.props.navigation)
              //console.log('navigation', this.props.navigation.state.params.district[0].value);
              this.parameterFilter = {
                listing_type: this.props.navigation.state.params.data?(this.props.navigation.state.params.data.listing_type?this.props.navigation.state.params.data.listing_type:'sale'):'sale',
                state: this.props.navigation.state.params.data?(this.props.navigation.state.params.data.state?this.props.navigation.state.params.data.state:'Kuala Lumpur'):(this.props.navigation.state.params.state?this.props.navigation.state.params.state:'Kuala Lumpur'),
                district: this.props.navigation.state.params?(this.props.navigation.state.params.district?this.props.navigation.state.params.district[0]?this.props.navigation.state.params.district[0].value?this.props.navigation.state.params.district[0].value:[]:[]:[]):[],
                bedroom_min: this.props.navigation.state.params.data?(this.props.navigation.state.params.data.bedRoomSelected?this.props.navigation.state.params.data.bedRoomSelected:''):'',
                asking_price_min: this.props.navigation.state.params.data?(this.props.navigation.state.params.data.asking_price_min?this.props.navigation.state.params.data.asking_price_min:{}):{},
                asking_price_max: this.props.navigation.state.params.data?(this.props.navigation.state.params.data.asking_price_max?this.props.navigation.state.params.data.asking_price_max:{}):{},
                build_up_min: this.props.navigation.state.params.data?(this.props.navigation.state.params.data.floor_area_min?this.props.navigation.state.params.data.floor_area_min:{}):{},
                build_up_max: this.props.navigation.state.params.data?(this.props.navigation.state.params.data.floor_area_max?this.props.navigation.state.params.data.floor_area_max:{}):{},
                land_area_min: this.props.navigation.state.params.data?(this.props.navigation.state.params.data.land_area_min?this.props.navigation.state.params.data.land_area_min:{}):{},
                land_area_max: this.props.navigation.state.params.data?(this.props.navigation.state.params.data.land_area_max?this.props.navigation.state.params.data.land_area_max:{}):{},
                furnishing: this.props.navigation.state.params.data?(this.props.navigation.state.params.data.furnishedType?this.props.navigation.state.params.data.furnishedType:''):'',
                rental_type: this.props.navigation.state.params.data?(this.props.navigation.state.params.data.rental_type?this.props.navigation.state.params.data.rental_type:'rl'):'rl',
                keyword: this.props.navigation.state.params.data?(this.props.navigation.state.params.data.keyword?this.props.navigation.state.params.data.keyword:''):(this.props.navigation.state.params.data?(this.props.navigation.state.params.data[0]?this.props.navigation.state.params.data[0].value:''):''),
                asset_id: this.props.navigation.state.params.data?(this.props.navigation.state.params.data.asset_id?this.props.navigation.state.params.data.asset_id:''):'',
                t: this.props.navigation.state.params.data?(this.props.navigation.state.params.data.t?this.props.navigation.state.params.data.t:''):"",
                chosenType: this.props.navigation.state.params.data?(this.props.navigation.state.params.data.listing_type?this.props.navigation.state.params.data.listing_type:'sale'):'sale',
                new_launch: this.props.navigation.state.params.data?(this.props.navigation.state.params.data.new_launch?this.props.navigation.state.params.data.new_launch:false):false,
                poi_lat: this.props.navigation.state.params.data?(this.props.navigation.state.params.data.poi_lat?this.props.navigation.state.params.data.poi_lat:''):'',
                poi_lon: this.props.navigation.state.params.data?(this.props.navigation.state.params.data.poi_lon?this.props.navigation.state.params.data.poi_lon:''):'',
                stations: this.props.navigation.state.params.data?(this.props.navigation.state.params.data.stations?this.props.navigation.state.params.data.stations:''):'',
            }    
          }
          /*
          * MRT Search filter          
          */
          if(this.props.navigation.state.params.data && this.props.navigation.state.params.data.t && this.props.navigation.state.params.data.t == "metro") {
            let stations = this.props.navigation.state.params.data;
            console.log('stations', stations);
            let unicode = []
            let keyword = []
            stations.filter(items => items.unicode ? unicode.push(items.unicode) : '') 
            stations.filter(items => items.name ? keyword.push(items.name) : '') 
            let keywordTxt = keyword.length > 0 ? keyword.join() : ''  
            this.parameterFilter.keyword = keywordTxt.length > 12 ? keywordTxt.substring(0,12) + '...' : keywordTxt;
            this.parameterFilter.stations = unicode.length > 0 ? unicode.join() : ''  
          }
//console.log('this.parameterFilter',this.parameterFilter)
            if(Object.keys(this.state.userInfo).length > 0 && this.state.userInfo.constructor === Object){
             // console.log('sdfdsfsdf sd fdsf dsf dsf dsf dsf ds');
              this._changeURL()  
            }
            

            //this._sendAPIRequest()
          
    }

    _handleOpenFeaturedProjects(){
      this.refs.navigationHelper._navigate('PropMall');
    }

    _handleSavedSearch() {
      this.setState({ showModal: true })
    }

    onPressBack() {
      /*this.setState({ toggleLoader: true })
      this._handleFilter(this.state.listingType)*/
    }  

    onCloseClick() {
      this.setState({ showModal: false })
    }

    _handleSavedSearch() {
      this.setState({ showModal: true })
    }

    _handleTypeChange(type) {
      this.parameterFilter.listing_type = type
      this.pageCount = 0
      this.setState({
            listingType: type,
            listingResult: [],
            filterChange: true,
            flagState: true,
            toggleLoader: true
      }, () => {
          this._changeURL();
      });
      //this.pageCount = 0;
    }

    async _hanldeSearchParamItems () {
      this.setState({ listingResult: [] })
      const auth = await AsyncStorage.getItem("authUser");
      if(auth && auth != '') {
        let authItems = JSON.parse(auth);
        //console.log(authItems)
        if(authItems.status == 1) {
          this.setState({ userInfo: authItems })
        }  
      }
      //this.didMount = true

    }

    async componentDidMount() {
      this.setState({ listingResult: [], toggleLoader: true })
      const auth = await AsyncStorage.getItem("authUser");
      if(auth && auth != '') {
        let authItems = JSON.parse(auth);
        //console.log(authItems)
        if(authItems.status == 1) {
          this.setState({ userInfo: authItems },()=> {
            this._changeURL()
          })
        }  
      }
     // console.log('sdfsdffds', this.props.navigation.state.params);
      this.didMount = true     
    }

    
    componentWillReceiveProps(nextProps) {
      //console.log("componentWillReceiveProps", nextProps , this.props);
      if(nextProps.navigation.state.params.data && (nextProps.navigation.state.params.data.t != 'metro' && nextProps.navigation.state.params.data.t != 'location') ) {
         this._setParams(nextProps.navigation.state.params)
      }
      if (nextProps.navigation && nextProps.navigation.state.params && nextProps.navigation.state.params.data && nextProps.navigation.state.params.data.from == "home") {
        if (nextProps.navigation.state.params.data.listing_type != this.parameterFilter.listing_type) { 
          this._handleFilter(nextProps.navigation.state.params.data.listing_type);
         
        }
      }
    }

    componentWillUnmount() {
        //this.messageListener();
        this.didMount = false;
    }

    onChangeText(text) {
      //console.log('sort by', text)
        this.setState({
          sortBy: text,
          listingResult: [],
          toggleLoader: true
      }, () => {
          this._changeURL();
      });
    }

     _handleFilter(item) {
      //console.log('item type',item)
      this.pageCount=0;
        this.setState({
            listingType: item,
            listingResult: [],
            filterChange: true

        }, () => {
            this._changeURL();
        });
     }

    _changeURL(){
     // console.log('sss', this.title)
     // this.listingResultURL = API_GET_LISTING_RESULT + API_DOMAIN +"app=1&" + this._handleParamSearchOption()+(this.pageCount > 0 ? "start="+this.pageCount+"&" : "")+"size="+ PAGE_SIZE+"&order_by="+this.state.sortBy+"";
      //console.log(this.listingResultURL);
      //this._callAPI(API_NEW, "salesandRent");
      if(this.title=='area'){
            let items = [];
            //this.parameterFilter.state = this.props.navigation.state.params.state?this.props.navigation.state.params.state:'Kuala Lumpur'
            //console.log('setState',this.props.navigation.state.params.state )
            //var tempFilter = this._handleParamSearchOption(this.props.navigation.state.params,true)
            this.parameterFilter.keyword = this.parameterFilter.keyword?this.parameterFilter.keyword:''
            let type = this.parameterFilter.listing_type == 'new_launch'?'sale':this.parameterFilter.listing_type
            let new_launch = this.parameterFilter.listing_type == 'new_launch'? 1: 0
            var tempFilter = 'state='+encodeURIComponent(this.parameterFilter.state)+'&keyword='+encodeURIComponent(this.parameterFilter.keyword)+'&listing_type='+type+'&new_launch='+new_launch+'&order_by='+this.state.sortBy+"&property_type=rl"
            /***
                commented by Monish
            ****/

            this.setState({ saveParams: tempFilter })
            this.listingResultURL = API_GET_LISTING_RESULT + API_DOMAIN + "app=1&" + tempFilter +(this.pageCount > 0 ? "&start="+this.pageCount+"&" : "")+"&size="+ PAGE_SIZE+"&uid="+this.state.userInfo.uid+"&cache=0";
            //console.log(' before',this.listingResultURL);
            //this.listingResultURL = API_GET_LISTING_RESULT + encodeURIComponent(API_DOMAIN + "app=1&listing_type=sale&page="+this.pageCount+"&pageSize="+ PAGE_SIZE);
      } else if(this.title=='searchoption' || this.title== 'CommonMap' || this.title == 'autoSearch'){
          if(this.title == 'searchoption') {
            //console.log(this._handleFilterSearchOption(this.parameterFilter));
            this.setState({ saveParams: this._handleFilterSearchOption(this.parameterFilter) })
            this.listingResultURL = API_GET_LISTING_RESULT + API_DOMAIN +"app=1&" + this._handleFilterSearchOption(this.parameterFilter)+(this.pageCount > 0 ? "&start="+this.pageCount+"&" : "")+"size="+ PAGE_SIZE+"&order_by="+this.state.sortBy+"&uid="+this.state.userInfo.uid+"&cache=0"; 
          } 
            
      } else if(this.title=='MRTSelectionNav'){
          //  console.log('MRTSelectionNav');
            //console.log('parameterFilter',this.parameterFilter.stations)
            var tempFilter = this._handleParamSearchOption(this.parameterFilter)
           // console.log(tempFilter);
            this.listingResultURL = API_GET_LISTING_RESULT + API_DOMAIN +"app=1&" + tempFilter + "stations=" + this.parameterFilter.stations + (this.pageCount > 0 ? "&start="+this.pageCount : "")+"&size="+ PAGE_SIZE+'&order_by='+this.state.sortBy+"&property_type=rl"+"&cache=0"
             
        } else {
        this.listingResultURL = API_GET_LISTING_RESULT + API_DOMAIN +"app=1&" + this._handleParamSearchOption()+(this.pageCount > 0 ? "start="+this.pageCount+"&" : "")+"size="+ PAGE_SIZE+"&order_by="+this.state.sortBy+"";
      }
     // this._callAPI(API_NEW, "salesandRent");
      this._sendAPIRequest(this.listingResultURL, "listingResult");
    }

    isObejctCheck(val,type,key) {
      if(typeof val === 'object' && val.constructor === Object) {
        
        if(val) {
            if(type == 'rental') {
                if(key == 'asking_price_max') {
                    if(val.id == 15000) {
                        return 0
                    } else {
                        return val.id
                    }
                }
                if(key == 'asking_price_min') {
                    if(val.id == 500) {
                        return 0
                    } else {
                        return val.id
                    }
                }

            } else {
                
                if(key == 'asking_price_max') {
                    if(val.id == 50000000) {
                        return 0
                    } else {
                        return val.id
                    }
                }
                if(key == 'asking_price_min') {
                    if(val.id == 100000) {
                        return 0
                    } else {
                        return val.id
                    }
                }
            }
            if(key == 'build_up_min') {
                    if(val.id == 250) {
                        return 0
                    } else {
                        return val.id
                    }
            }
            if(key == 'build_up_max') {
                    if(val.id == 10000) {
                        return 0
                    } else {
                        return val.id
                    }
            }
            if(key == 'land_area_min') {
                    if(val.id == 250) {
                        return 0
                    } else {
                        return val.id
                    }
            }
            if(key == 'land_area_max') {
                    if(val.id == 10000) {
                        return 0
                    } else {
                        return val.id
                    }
            }
        } else {
            return 0
        }
      } else {

          if(val) {
            if(type == 'rental') {
                if(key == 'asking_price_max') {
                    if(val.id == 15000) {
                        return 0
                    } else {
                        return val
                    }
                }
                if(key == 'asking_price_min') {
                    if(val.id == 500) {
                        return 0
                    } else {
                        return val
                    }
                }

            } else {
                
                if(key == 'asking_price_max') {
                    if(val.id == 50000000) {
                        return 0
                    } else {
                        return val
                    }
                }
                if(key == 'asking_price_min') {
                    if(val.id == 100000) {
                        return 0
                    } else {
                        return val
                    }
                }
            }
            if(key == 'build_up_min') {
                    if(val.id == 250) {
                        return 0
                    } else {
                        return val
                    }
            }
            if(key == 'build_up_max') {
                    if(val.id == 10000) {
                        return 0
                    } else {
                        return val
                    }
            }
            if(key == 'land_area_min') {
                    if(val.id == 250) {
                        return 0
                    } else {
                        return val
                    }
            }
            if(key == 'land_area_max') {
                    if(val.id == 10000) {
                        return 0
                    } else {
                        return val
                    }
            }
          } else {
              return 0
          }

      }
    }

    _handleFilterSearchOption(data) {
     //console.log('_handleFilterSearchOption',data);
        var temp = ''
        let type = data.listing_type.value?data.listing_type.value.toLowerCase():(data.listing_type?data.listing_type:'')
        if(data) {
            let paramSearch = {
                state: data.state ? (data.state != 'all' ? encodeURIComponent(data.state): '') : encodeURIComponent("Kuala Lumpur"),
                listing_type: type == 'new_launch'?'sale':type,
                start:0,
                size:20,
                property_type: data.rental_type?data.rental_type:'rl',
                asking_price_max: this.isObejctCheck(data.asking_price_max,type,'asking_price_max'),
                asking_price_min: this.isObejctCheck(data.asking_price_min,type,'asking_price_min'),
                beds:data.bedroom_min?data.bedroom_min:0,
                build_up_min: this.isObejctCheck(data.build_up_min,type,'build_up_min'),
                build_up_max: this.isObejctCheck(data.build_up_max,type,'build_up_max'),
                land_area_min: this.isObejctCheck(data.land_area_min,type,'land_area_min'),
                land_area_max: this.isObejctCheck(data.land_area_max,type,'land_area_max'),
                furnished: data.furnishing?data.furnishing:'',
                featured: 1,//this.props.navigation.state.params.data?.new_launch?0:1,
                new_launch: type == 'new_launch'?1:0, 
                keyword: this.props.navigation.state.params.data?(this.props.navigation.state.params.data[0]?this.props.navigation.state.params.data[0].value:''):'',
                asset_id: data.asset_id?data.asset_id:'',
                poi_lat: data.poi_lat?data.poi_lat:'',
                poi_lon: data.poi_lon?data.poi_lon:'',
                district: data.district ? encodeURIComponent(data.district) : '', 
                keyword: data.keyword ? encodeURIComponent(data.keyword) :'',
                stations: data.stations?data.stations:''
            }
            Object.keys(paramSearch).map((item, index)=>{
                if(paramSearch[item]){
                        temp+=(item+'='+paramSearch[item]+'&')
                }
            })

            return temp;    
        }
    }

    _handleParamSearchOption(data,flag){
          var temp = ''
          let paramSearch = {
              listing_type: this.parameterFilter.listing_type,
              state: encodeURIComponent('Kuala Lumpur'),
              uid: this.state.userInfo.uid

            } 
          if(this.parameterFilter.listing_type == 'auction') {
            paramSearch={};
            paramSearch = {
              listing_type: this.parameterFilter.listing_type,
              state: encodeURIComponent('Kuala Lumpur'),
              featured: 1,
              uid: this.state.userInfo.uid

            }  
          } 
          if(this.parameterFilter.listing_type == 'new_launch') {
            paramSearch={};
            paramSearch = {
              listing_type: 'sale',
              state: encodeURIComponent('Kuala Lumpur'),
              new_launch : 1,
              uid: this.state.userInfo.uid

            }  
          } 
          Object.keys(paramSearch).map((item, index)=>{
              if(paramSearch[item]){
                      temp+=(item+'='+paramSearch[item]+'&')
              }
          })
          //console.log('sdf', temp)
          return temp;        
    }

    _setParameterValue1(val) {
        // if the data is object
        let tempVal = ''
        //console.log('check object');
        if (val && val instanceof Object && Object.keys(val).length!==0) {
            tempVal += val.id
        }
        return tempVal
    }

    _setParameterValue2(val) {
        // if the data is array of string, array of object
        let tempVal = ''
        if (val.length > 0) {
            val.map((item, i) => {
                tempVal += (item.id != undefined ? item.id : item) + (i < val.length - 1 ? ',' : '')
            })
        }
        return tempVal
    }

    _setParameterValue3(val,index){
        // if the data string seperated by -
        let tempVal = ''
        if(val.length > 0){
            let res = val[0].split('-')[index];
            if (!['33', '36', '60', '70'].includes(res)) {
              tempVal = res;
            }
        }
        return tempVal;
    }

    _setParameterValue4(val) {
        return (val)? 1:0;
    }

    _setParameterValue5(val) {
        // if the data is array of string, array of object
        let tempVal = ''
        if (val.length > 0) {
            val.map((item, i) => {
                tempVal += (item.value != undefined ? encodeURIComponent(item.value) : encodeURIComponent(item)) + (i < val.length - 1 ? ',' : '')
            })
        }
        return tempVal
    }



    _handleFirstConnectivityChange(isConnected, apiUrl, stateName) {
      if (isConnected) {
         this._sendAPIRequest(apiUrl, stateName);
      }
      NetInfo.isConnected.removeEventListener('connectionChange', (isConnected)=>this._handleFirstConnectivityChange(isConnected, apiUrl, stateName));
    }

    _callAPI(apiUrl, stateName) {
      if (Platform.OS === 'ios') {
        NetInfo.isConnected.addEventListener('connectionChange', (isConnected)=>this._handleFirstConnectivityChange(isConnected, apiUrl, stateName));
      }
      else {
        NetInfo.isConnected.fetch().then(isConnected => {
          if (isConnected) {
             this._sendAPIRequest(apiUrl, stateName);
          }
        });
      }
    }

    _sendAPIRequest(apiUrl, stateName){
      console.log('apiUrl',apiUrl)
      if (!this.state[stateName].results) {
          fetch(apiUrl,
              {
                  method: 'GET', timeout: TIMEOUT
              }).
              then((response) => response.json()).
              then((responseJson) => {
                  //console.log('responseJson', responseJson);
                  if (responseJson) {
                      if (this.totalListing != responseJson.found) {
                          this.totalListing = responseJson.found
                      }
                      //if (this.totalPage < Math.ceil(this.totalListing / PAGE_SIZE)) {
                        this.totalPage = Math.floor(this.totalListing / PAGE_SIZE)
                      // }

                      if (this.didMount) {
                          if (this.state[stateName].length > 0) {
                              let res = responseJson.property? responseJson.property : [];
                              /*this.setState({
                                  [stateName]: [...this.state[stateName], ...this._validateData(this.state[stateName], res , 2 * this.PAGE_SIZE)]
                              });*/

                              this.setState({
                                    [stateName]: [...this.state[stateName], ...this._validateData(this.state[stateName], res , 2 * this.PAGE_SIZE)],
                                },() => this._handleNoData(stateName));
                          }
                          else {
                              /*this.setState({
                                  [stateName]: responseJson.property ? responseJson.property : []
                              });*/
                              this.setState({
                                    [stateName]: responseJson.property ? responseJson.property : [],
                                },() => this._handleNoData(stateName));
                          }
                      }
                  }

              })
              .catch((error) => {
                  console.log(error);
              });
      }
    }

    _handleNoData(stateName) {
       // console.log('_handleNoData', stateName);
      //  console.log('listingResult', Object.keys(this.state.listingResult).length)
        if(stateName == 'listingResult' && Object.keys(this.state.listingResult).length > 0) {
            this.setState({ noItem : false, toggleLoader: false })
        }
        if(stateName == 'listingResult' && Object.keys(this.state.listingResult).length == 0) {
            this.setState({ noItem : true, toggleLoader: false  })
        }
    }

    _validateData(currentData, incomingData, latestSize) {

        latestSize = latestSize || currentData.length
        start = currentData.length - latestSize > 0 ? currentData.length - latestSize : 0
        currrentData = currentData.slice(start)
        validatedData = []
        i = 0
        flag = true
        if(incomingData){
            while (i < incomingData.length) {
                j = 0
                flag = true
                while (j < currentData.length && flag) {
                    if (incomingData[i].nid_i === currentData[j].nid_i) {

                        flag = false
                    }
                    j++
                }
                if (flag) {
                    validatedData.push(incomingData[i])
                }
                i++
            }
        }
        //console.log(validatedData);
        return validatedData
    }


    _handleOnPressHeaderSearch() {
        // Alert.alert("Comming Soon", `Common HeaderSearch Touched, this feature will be coming soon`);
        this.refs.navigationHelper._navigateInMenu("PropertySearchMenu", {
         data: {
            hintText : this.parameterFilter.keyword,
            proprtyType: this.parameterFilter.listing_type
         }
       })
    }

    _handleMenuButton() {
        this.refs.menu._toggleMenu()
    }

    _handleOnPressListing(item, index) { 
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
        this.refs.navigationHelper._navigate('ListingDetailNav', {
            data: {
                property_id: (item.nid_i && item.nid_i >0)? item.nid_i: item.mid_i,
                listing_type: item.type_s == 'rent'?'rental':item.type_s,key: (item.nid_i && item.nid_i >0)? 'n': 'm',
                uid: item.uid_i,
                nid: item.nid_i,
                mid: item.mid_i,
                lat: mapData[0]?mapData[0]:0,
                lan: mapData[1]?mapData[1]:0,
                state: item.state_s_lower?item.state_s_lower:'',
                area: item.district_s_lower?item.district_s_lower:'',
                project: item.title_t?item.title_t:'',
                shortlisted: item.shortlist?true: false,
                itemId: item.id?item.id:0,
                newLaunch: this.parameterFilter.listing_type == 'new_launch'?1:0,
                askingPrice: item.field_prop_asking_price_d
            },
            onGoBack: this.onPressBack
        }) 
    }

    _formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }

    _handleLoadMore() {
        this.pageCount++;
        if (this.pageCount <= this.totalPage) {
            this._changeURL();
        }
    }

    _getAllParameters() {

        if(this.parameterFilter){
            return ({
            listing_type: this.parameterFilter.listing_type,
            district: this.parameterFilter.district,
            state: this.parameterFilter.state,
            bedroom_min: this.parameterFilter.bedroom_min,
            asking_price_min: this.parameterFilter.asking_price_min,
            asking_price_max: this.parameterFilter.asking_price_max,
            build_up_min: this.parameterFilter.build_up_min,
            build_up_max: this.parameterFilter.build_up_max,
            land_area_min: this.parameterFilter.land_area_min,
            land_area_max: this.parameterFilter.land_area_max,
            furnishing: this.parameterFilter.furnishing,
            rental_type: this.parameterFilter.rental_type,
            keyword: this.parameterFilter.keyword,
            asset_id: this.parameterFilter.asset_id,
            chosenType: this.parameterFilter.chosenType,
            stations: this.parameterFilter.stations?this.parameterFilter.stations:'',
            poi_lon: this.parameterFilter.poi_lon,
            poi_lat: this.parameterFilter.poi_lat
        })
        }
    }

    _handlerOnPressSearch() {
      let type = 'sale'
      if(this.parameterFilter.listing_type == 'rental') {
        type = 'rent'
      } else  if (this.parameterFilter.listing_type == 'auction') {
        type = 'auction'
      } else if(this.parameterFilter.listing_type == 'new_launch') {
        type = 'new_launch'
      }
     // console.log('data', this._getAllParameters())
      this.refs.navigationHelper._navigate('SearchOption', {
          data: this._getAllParameters()
      })

      /*this.refs.navigationHelper._navigate('SearchOption', {
          data: this._getAllParameters(),
          title: this.props.navigation.state.params.data.titleCheck,
          searchResultFeedback: this._searchResultFeedback,
      })*/
    }

    render() {
      let keyword = 'Start a Search'
      if(this.parameterFilter.keyword != undefined && this.parameterFilter.keyword != '') {
          keyword = decodeURIComponent((this.parameterFilter.keyword + '').replace(/\+/g, '%20'))
      }
      if(this.parameterFilter.poi_lat && this.parameterFilter.poi_lon){
        keyword = 'Current location'
      }

     // console.log('result', this.lis);
      var icon = require('../../assets/icons/menu_more.png');
        return (
            <View style={ styles.lisitngContainer }>
                <Common_Menu ref={"menu"} navigation={this.props.navigation} />
                <NavigationHelper
                    ref={"navigationHelper"}
                    navigation={this.props.navigation} />
                <AppStateChange/>
                
                <View style={{ flex: 1 }}>
                   <View style={{ marginTop: 25 }} >
                         <HeaderSearch 
                            style={{position:'relative'}}
                            ref={'headerSearch'}
                            hintText={keyword}
                            editable={true}
                            fontSize={15}
                            onIconPress={this._handlerOnPressSearch}
                            showIconSearch={true}
                            isHomePage={false}
                            needsEdit={false}
                            onPress={this._handleOnPressHeaderSearch}
                            isProperty={true}
                            onSavedSeachPress={this._handleSavedSearch}
                            userInfo={this.state.userInfo}
                            navigation={this.props.navigation}
                          />
                    </View>
                     {this.state.showModal && (
                        <SaveSearch 
                          closeModal={this.onCloseClick}
                          saveParams={this.state.saveParams}
                          type={this.parameterFilter.listing_type}
                        />
                    )}
                    <View style={styles.headerText}>
                       <TouchableOpacity onPress={()=> this._handleTypeChange('sale')}>
                         <Text allowFontScaling={false} style={[this.parameterFilter.listing_type == 'sale'?styles.headerTextChildActive:styles.headerTextChild]}>
                            <Text>Buy</Text>
                         </Text>
                        </TouchableOpacity> 
                       <TouchableOpacity onPress={()=> this._handleTypeChange('rental')}>
                         <Text allowFontScaling={false} style={[this.parameterFilter.listing_type == 'rental'?styles.headerTextChildActive:styles.headerTextChild]}>
                            <Text>Rent</Text>
                         </Text>
                       </TouchableOpacity>
                       <TouchableOpacity onPress={()=> this._handleOpenFeaturedProjects()}>
                         <Text allowFontScaling={false} style={[this.parameterFilter.listing_type == 'new_launch'?styles.headerTextChildActive:styles.headerTextChild]}>
                            <Text allowFontScaling={false}>New Launch</Text>
                         </Text>
                       </TouchableOpacity> 
                       <TouchableOpacity onPress={()=> this._handleTypeChange('auction')}>
                         <Text allowFontScaling={false} style={[this.parameterFilter.listing_type == 'auction'?styles.headerTextChildActive:styles.headerTextChild]}>
                            <Text allowFontScaling={false}>Auction</Text>
                         </Text>
                        </TouchableOpacity> 
                    </View>
                     
                         <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: -15, marginBottom: 0 }}>
                            <View style={{ marginRight: 10 }}>
                              <Text allowFontScaling={false} style={styles.sortText}>Sort By:</Text>
                            </View>
                            <View style={{ minWidth: 165, flex: 1, paddingLeft: 5 }}>
                              <Dropdown
                                allowFontScaling={false}
                                label=' '
                                value={this.state.sortBy}
                                data={filter}
                                baseColor={'#488BF8'}
                                selectedItemColor={'#488BF8'}
                                inputContainerStyle={{ borderBottomColor: 'transparent' }}
                                textColor={'#488BF8'}
                                itemColor={'#414141'}
                                onChangeText={this.onChangeText}
                                fontFamily={'Poppins-Regular'}
                                dropdownPosition={1}
                                labelHeight={width * 0.05}
                                fontSize={width * 0.04}
                              />
                            </View>
                            <View style={{ width:'30%' }}/>
                          </View>

                    <View style={{flex:1}}>
                      <View style={{display: this.totalListing<0 ? 'none' : 'flex', flex:1}}>
                        <ListingResultList
                            bookmarkList={this.state.bookmarkList}
                            navigation={this.navigation}
                            items={this.state.listingResult}
                            onPressItem={this._handleOnPressListing}
                            totalListing = {this._formatNumber(this.totalListing)}
                            onLoadMore={this._handleLoadMore}
                            isEndOfData={this.pageCount >= this.totalPage}
                            onUpdateBookmark={() =>{}}
                            newLaunch={this.newLaunch}
                            isShortlist={false}
                            handleChange={this._handleFilter}
                            listingType={this.parameterFilter.listing_type}
                        />
                    </View>
                      {this.state.toggleLoader ?
                        <Loading/>:
                        <View/>
                      }
                      {(this.state.noItem) &&
                        <View style={{
                        flex: 1, 
                            alignItems: 'center',
                            justifyContent: 'center', 
                        }}>
                        <Text allowFontScaling={false} style={{ fontFamily: 'Poppins-SemiBold', marginTop: -20, fontSize: 23, color: '#414141' }}>
                           Sorry! No items found! 
                        </Text>
                        </View>
                      }
                    </View>
                </View>
            </View>
        )
    }
}

export default ExploreLanding