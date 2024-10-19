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
    TextInput
} from 'react-native';
import firebase from 'react-native-firebase';
import type { RemoteMessage } from 'react-native-firebase';
//import { Crashlytics } from 'react-native-fabric';
import StatusBarBackground from '../../components/Common_iOSStatusBar/Common_iOSStatusBar';
import HeaderSearch from '../../components/Common_HeaderSearch/Common_HeaderSearch';
import Home_List from '../../components/Home_List/Home_List';
import LandingHighlight from '../../components/Common_LandingHighlight/Common_LandingHighlight.js';
import IconMenu from '../../components/Common_IconMenu/Common_IconMenu.js';
import Common_MenuList from '../../components/Common_MenuList/Common_MenuList';
import Common_Menu from '../../components/Common_Menu/Common_Menu';
import dataMenu from '../../assets/json/menu.json';
import { Dropdown } from 'react-native-material-dropdown';
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js';
import HomeActions from '../../realm/actions/HomeActions';
import MigrationActions from '../../realm/actions/MigrationActions';
import Loading from '../../components/Common_Loading/Common_Loading';
import AppStateChange from '../../components/AppStateChange/AppStateChange';
import appsFlyer from 'react-native-appsflyer';
//import AppLovin from '../../components/AppLovin/AppLovin';
import TenureOptions from '../../assets/json/Search_Data/TenureOptions.json';
import { CheckBox } from 'react-native-elements';
import PropmallRegisterModal from '../../app/PropmallRegister/PropmallRegisterModal.js';
import PropMallSwiper from '../../app/PropmallSwiper/PropmallSwiper.js'
import styles from './PropMallDetailStyle.js'
import PropertyTypeOptions from '../../assets/json/Search_Data/PropertyTypeOptions.json'
import TypeOptions from '../../assets/json/Search_Data/TypeOptions.json'
import DistrictOptions from '../../assets/json/Search_Data/DistrictOptions.json'
import ListingDetailLocation from '../../app/ListingDetailLocation/ListingDetailLocationNav';

//const HOSTNAME = "https://www.edgeprop.sg";
//const PROXY_URL = "/proxy?url=";
//const API_DOMAIN = "https://api.theedgeproperty.com.sg";
//const API_GET_MAIN_RECOMMENDED_PROPERTIES = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN + "/propertypicks/list?types=sale&multiimg=true&moreinfo=true");
//const API_GET_MAIN_NEW_PROJECTS = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN + "/newlaunches/list?category=any&limit=5&forcerandom=false"); //temporary hide upon bernard request
//const API_GET_MAIN_BELOW_VALUATION_PROPERTIES = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN + "/propertypicks/list?types=sale&multiimg=true&moreinfo=true&deals=true");
const TIMEOUT = 1000;
//const API_NEW_LAUNCH = "https://www.edgeprop.my/jwdsonic/api/v1/property/featured-listings/5"
//JSON url
//const API_NEW = "https://alice.edgeprop.my/api/v1/view/home/2k18";
//const API_SAVED_SEARCH = "https://alice.edgeprop.my/api/user/v1/get-saved-search";

const API_FEATUREDPROJECTS_DETAILS = "https://prolex.edgeprop.my/api/v1/fetchOne";

const API_GET_AMENITIES = "https://www.edgeprop.my/getAmenitiesNearBy/"
var agentImage  = "https://sg.tepcdn.com/images/avatar.png"

const menuList = [
  { label : 'Sale' , image: '../../assets/images/sale_img.png'},
  { label : 'News Launch' , image: '../../assets/images/news_launch.png'},
  { label : 'Rent' , image: '../../assets/images/rent_img.png'},
  { label : 'News' , image: '../../assets/images/news.png'},
];
const filter = [
  { label: 'Relevance' , value: 'relevance' },
  { label: 'Latest First' , value: 'posted_desc' },
  { label: 'Price Low to High' , value: 'price_asc' },
  { label: 'Price High to Low' , value: 'price_desc' }
];

class PropMall extends Component {
    
    static navigationOptions = ({ navigation }) => {
        return {
          header: null
        };
      };
      constructData
    constructor(props) {
        super(props);
        this.navigation = props.navigation
        this.params = this.navigation.state.params
        this.MigrationActions = new MigrationActions()
        this.MigrationActions.MigrateSchema();
        this.HomeActions = new HomeActions()
        this.state = {
            mainNewProjects: [], //temporary hide upon bernard request
            //mainRecommendedProperties: this.HomeActions.GetRecommendedProperties(),
            //mainBelowValuationProperties: this.HomeActions.GetBelowValuationProperties(),
            isFocused: true,
            newLaunches: [],
            sale: [], // this.HomeActions.GetNewSaleProperties(),
            rent: [], //this.HomeActions.GetNewRentProperties(),
            savedSearches: [],
            onRegister: false,
            listingHighlight: {},
            floorPlanImage: {},
            listingPriceInfo: {},
            listingInfo: {},
            listingDescription: {},
            listingKeyDetails: [],
            listingContact: {},
            listingFeatures: [],
            listingFacilities: [],
            listingInOutSpace: {},
            shareUrl: '',
            Img: [],
            facilitiesFeatures: [],
            getAmenitiesValue: [],
            agentData : [],
            mid: '',
            nid: '',
            developers: [],
            nearbyListing: [],
            floorPlan: []
        }

        this._handleRegister = this._handleRegister.bind(this)
        this._closeRegisterModal = this._closeRegisterModal.bind(this)

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
        this._typeFormat = this._typeFormat.bind(this);
        this._details = this._details.bind(this);
        this.featuredProjectDetailURL = '';
        this._getLabel = this._getLabel.bind(this);
        this._prefixType = this._prefixType.bind(this);
        this._handleCollection = this._handleCollection.bind(this);
        this.getAmenities = this.getAmenities.bind(this);
        this._callAmenitiesAPI = this._callAmenitiesAPI.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        // this.setState({
        //     isFocused: nextProps.screenProps.tabKey == this.navigation.state.key
        // })
    }

    _handleRegister() {
      this.setState({ onRegister : true })
    }

    _closeRegisterModal() {
     //console.log('sdgjfgdj dfgdfkjdfj');
      this.setState({ onRegister : false })
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

    async componentDidMount() {
      //this._callAPI(API_GET_MAIN_NEW_PROJECTS, "mainNewProjects"); //temporary hide upon bernard request
      //AppLovin.initialize();
      // AppLovin.createInterstitialAd(); //uncomment this to see the ads
      //this._callAPI(API_GET_MAIN_RECOMMENDED_PROPERTIES, "mainRecommendedProperties");
      //this._callAPI(API_GET_MAIN_BELOW_VALUATION_PROPERTIES, "mainBelowValuationProperties");
      const auth = await AsyncStorage.getItem("authUser");
      if(auth && auth != '') {
        let authItems = JSON.parse(auth);

        if(authItems.status == 1) {
          this.setState({ userInfo: authItems, itemLoaded: true })
        }
      }

      //this._callAPI(API_NEW, "salesandRent");
      //this._callAPI(API_NEW_LAUNCH, "featureProjects");
      //this._callAPI(API_SAVED_SEARCH, "savedSearches");
      this._details();

      
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
       // this.messageListener();
    }

    _getType(id) {
      let propertyType = [
        {
            "label": "All Types",
            "value": ""
        },
        {
            "label": "Residential",
            "value": "rl"
        },
        {
            "label": "Residential (landed only)",
            "value": "l-36"
        },
        {
            "label": "Residential (non landed only)",
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

      if (result != undefined) {
        return result;
      } else {
        return "";
      }
    }

    _typeFormat(type, params) {
      let itemList = '';
      if(params.state != undefined && params.state != '') {
        itemList += params.state?'State: '+params.state+' ':'Kuala Lumpur '+' '
      }
      if(!params.state) {
        itemList +=  'State:  Kuala Lumpur '
      }
      if(params.beds != undefined && params.beds != '') {
        itemList += params.beds  != "0"?'Beds: '+params.beds:' Studio '
      }
      if(params.build_up_max != undefined && params.build_up_max != '') {
        itemList += ' Buildup Max: '+params.build_up_max+' sqft '
      }
      if(params.build_up_min != undefined && params.build_up_min != '') {
        itemList += ' Buildup Min: '+params.build_up_min+' sqft '
      } 
      if(type) {
        if(type == 'sale' ) {
          itemList += 'Buy '  
        }else if(type == 'new_launch') {
          itemList += ' New Launch'
        }else {
          itemList += type.charAt(0).toUpperCase() + type.slice(1);
        }
      }
      return itemList
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
      NetInfo.isConnected.removeEventListener('connectionChange', (isConnected)=>this._handleFirstConnectivityChange(isConnected, apiUrl, stateName));
    }

    _getLabel(key,collection){
        let res ='';
        //console.log('key',key);
        //console.log('collection',collection);
        if(key && collection.length > 0){
            res = collection.filter(value => value.id == key)
        }
        //console.log('res',res);

        res = res[0]? res[0].value : '';
        return res;
    }

    _prefixType(id){
        var prefix = '';
        if(33<id && id<36){
            prefix = 'r-';
        }else if(36<id || id<45){
            prefix = 'r-';
        }else if(60<id || id<70){
            prefix = 'c-';
        }else if(70<id || id<74){
            prefix = 'i-';
        }
        //console.log('prefix',prefix);
        return prefix+id;
    }

    _handleCollection(key,collection) {
        let temp = []
        for (i = 0; i < collection.length; i++) {
            temp = [...temp, ...collection[i][key].map(data => data)];
        }
        return temp
    }

    _constructData(result) {
            let change_date = '';
            if(result.changed) {
                change_date = new Date(result.changed * 1000)
                
            }
            //console.log('result', result)
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


            var images = result.field_prop_images? (result.field_prop_images.und? result.field_prop_images.und : []) : [];
                images = images.map((obj, i) => {
                    return obj['list_uri']
                })
            //console.log('images',images);
            let listingHighlight = {
                images: images
            }
            let floorPlanImage ={
                images: images
            }
            if(result.video_url != undefined && result.video_url.indexOf("https://www.youtube.com/watch")>-1){
              listingHighlight.images.push(result.video_url)
            }
            let listingPriceInfo = {
                listingType: result.field_prop_listing_type? (result.field_prop_listing_type.und? (result.field_prop_listing_type.und[0] ? result.field_prop_listing_type.und[0].value : ''): '') : '',
                askingPriceType: result.field_prop_asking_price_type? (result.field_prop_asking_price_type.und? (result.field_prop_asking_price_type.und[0] ? result.field_prop_asking_price_type.und[0].value : ''): '') : '',
                askingPrice: result.field_prop_asking_price? (result.field_prop_asking_price.und? (result.field_prop_asking_price.und[0] ? result.field_prop_asking_price.und[0].value : ''): '') : '',
                askingSlogan: result.field_listing_slogan? (result.field_listing_slogan.und? (result.field_listing_slogan.und[0] ? result.field_listing_slogan.und[0].value : ''): '') : '',
                fairValue: result.fair_value? result.fair_value: '',
                coverImage: result.field_cover_image? (result.field_cover_image.und? (result.field_cover_image.und[0] ? result.field_cover_image.und[0].cdn_uri : ''): '') : '',
                lat: result.field_geo_lat_lng? (result.field_geo_lat_lng.und? (result.field_geo_lat_lng.und[0] ? result.field_geo_lat_lng.und[0].lat : ''): '') : '',
                lng: result.field_geo_lat_lng? (result.field_geo_lat_lng.und? (result.field_geo_lat_lng.und[0] ? result.field_geo_lat_lng.und[0].lng : ''): '') : '',
                facilitiesValues: result.field_prop_additional_amenities? (result.field_prop_additional_amenities.und? (result.field_prop_additional_amenities.und[0] ? result.field_prop_additional_amenities.und[0].value : ''): '') : '',
            }
            //console.log('listingPriceInfo',listingPriceInfo);

            let tenure = result.field_prop_lease_term? (result.field_prop_lease_term.und? (result.field_prop_lease_term.und[0] ? result.field_prop_lease_term.und[0].value : ''): '') : '';
            let tenureLabel = this._getLabel(tenure,TenureOptions);
                tenure = tenureLabel? tenureLabel : tenure;

            let subType = result.field_property_type? (result.field_property_type.und? (result.field_property_type.und[1] ? result.field_property_type.und[1].target_id : ''): '') : '';
            let subTypeLabel =this._getLabel(this._prefixType(subType),this._handleCollection('sub',PropertyTypeOptions));
                subType = subTypeLabel? subTypeLabel: '';

            let listingType  = result.field_prop_listing_type? (result.field_prop_listing_type.und? (result.field_prop_listing_type.und[0] ? result.field_prop_listing_type.und[0].value : ''): '') : '';
            let listingTypeLabel  = this._getLabel(listingType,TypeOptions);
                listingType  = listingTypeLabel? listingTypeLabel : 'listingType';

            let district = result.field_district? (result.field_district.und? (result.field_district.und[0] ? result.field_district.und[0].target_id : ''): '') : ''
            let districtLabel = this._getLabel(district,this._handleCollection('items',DistrictOptions));
                district = districtLabel? districtLabel : '';

            let listingInfo = {
                title: result.title,
                assetDistrict: district,
                assetStreetName: result.field_prop_street? (result.field_prop_street.und? (result.field_prop_street.und[0] ? result.field_prop_street.und[0].value : ''): '') : '',
                assetPostalCode: result.field_prop_postcode? (result.field_prop_postcode.und? (result.field_prop_postcode.und[0] ? result.field_prop_postcode.und[0].value : ''): '') : '',
                state: result.state,
                propertySubType: result.field_property_type? (result.field_property_type.und? (result.field_property_type.und[0] ? result.field_property_type.und[0].target_id : ''): '') : '',
                floorLocation: result.field_prop_floor_location? (result.field_prop_floor_location.und? (result.field_prop_floor_location.und[0] ? result.field_prop_floor_location.und[0].value : ''): '') : '',
                assetYearCompleted: result.field_completion_year? (result.field_completion_year.und? (result.field_completion_year.und[0] ? result.field_completion_year.und[0].value : ''): '') : '',
                assetTenure: tenure,
                bedrooms: result.field_prop_bedrooms? (result.field_prop_bedrooms.und? (result.field_prop_bedrooms.und[0] ? result.field_prop_bedrooms.und[0].value : ''): '') : '',
                bathrooms: result.field_prop_bathrooms? (result.field_prop_bathrooms.und? (result.field_prop_bathrooms.und[0] ? result.field_prop_bathrooms.und[0].value : ''): '') : '',
                pricepu: result.field_prop_built_up_price_pu? (result.field_prop_built_up_price_pu.und? (result.field_prop_built_up_price_pu.und[0] ? result.field_prop_built_up_price_pu.und[0].value : ''): '') : '',
                landArea: result.field_prop_built_up? (result.field_prop_built_up.und? (result.field_prop_built_up.und[0] ? result.field_prop_built_up.und[0].value : ''): '') : '',
                landAreaUnit: result.field_prop_built_up_unit? (result.field_prop_built_up_unit.und? (result.field_prop_built_up_unit.und[0] ? result.field_prop_built_up_unit.und[0].value : ''): '') : '',
                furnished: result.field_prop_furnished? (result.field_prop_furnished.und? (result.field_prop_furnished.und[0] ? result.field_prop_furnished.und[0].value : ''): '') : ''
            }
            //console.log('listingInfo',result);
            let listingDescription = { info: result.field_prop_info?  (result.field_prop_info.und? (result.field_prop_info.und[0] ? result.field_prop_info.und[0].value : ''): '') : ''}
            let listingKeyDetails = {
                listingId: result.mid?'LIDM '+result.mid : 'LIDN '+result.nid,
                type: this.params.data.listing_type,
                size: result.field_prop_built_up? (result.field_prop_built_up.und? (result.field_prop_built_up.und[0] ? result.field_prop_built_up.und[0].value : ''): '') : '',
                sizeUnit: result.field_prop_built_up_unit? (result.field_prop_built_up_unit.und? (result.field_prop_built_up_unit.und[0] ? result.field_prop_built_up_unit.und[0].value : ''): '') : '',
                psf:  result.field_prop_built_up_price_pu? (result.field_prop_built_up_price_pu.und? (result.field_prop_built_up_price_pu.und[0] ? "RM " +result.field_prop_built_up_price_pu.und[0].value : ''): '') : '',
                landAreaPsf: result.field_prop_land_area_sqft? (result.field_prop_land_area_sqft.und? (result.field_prop_land_area_sqft.und[0] ? "RM " +result.field_prop_land_area_sqft.und[0].value : '-'): '-') : '-',
                top: result.field_completion_year? (result.field_completion_year.und? (result.field_completion_year.und[0] ? result.field_completion_year.und[0].value : ''): '') : '',
                asset_tenure: tenure,
                tenure: tenure,
                landSize: result.field_prop_land_area? (result.field_prop_land_area.und? (result.field_prop_land_area.und[0] ?result.field_prop_land_area.und[0].value : '-'): '-') : '-',
                furnishing: result.field_prop_furnished? (result.field_prop_furnished.und? (result.field_prop_furnished.und[0] ? result.field_prop_furnished.und[0].value : ''): '') : '',
                floorLevel: result.field_prop_floor_location? (result.field_prop_floor_location.und? (result.field_prop_floor_location.und[0] ? result.field_prop_floor_location.und[0].value : ''): '') : '',
                reListed: change_date.getDate() + " " + months[change_date.getMonth()] + " " + change_date.getFullYear(),
            }
        //console.log('listingKeyDetails',listingKeyDetails);
            let features = result.field_prop_features? (result.field_prop_features.und?  result.field_prop_features.und : []) : [];
                
                //console.log("features",features);
            let facilities = result.field_prop_fixtures_fittings? (result.field_prop_fixtures_fittings.und? result.field_prop_fixtures_fittings.und : []) : [];
                
            let inOutSpace = result.field_prop_inout_space? (result.field_prop_inout_space.und? result.field_prop_inout_space.und : []) : [];
                
            let shareUrl = result.url?result.url:''    
            //console.log('facilities',facilities);
            listingFeatures = { data: features}
            listingFacilities = { data: facilities}
            listingInOutSpace = { data: inOutSpace}

            let floorPlan = result.floorPlan?(result.floorPlan.length > 0?result.floorPlan:[]):[] 
            this.setState({ floorPlan })

              this.setState({
                  listingHighlight: listingHighlight,
                  floorPlanImage: floorPlanImage,
                  listingPriceInfo: listingPriceInfo,
                  listingInfo: listingInfo,
                  listingDescription: listingDescription,
                  listingKeyDetails: listingKeyDetails,
                  listingInOutSpace: listingInOutSpace,
                  listingFeatures: listingFeatures,
                  listingFacilities: listingFacilities,
                  shareUrl: shareUrl
              })
              this.constructData = true

    }

   

    _callAPI(apiUrl, params, stateName,method) {
        console.log(apiUrl, params)
    let key = this.state.userInfo.accesskey    
      //  console.log(key)
    let m = 'POST';
    if(method == 'GET') {
        m = 'GET';
    }
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                if(m == 'POST'){
                   fetch(apiUrl,
                    {
                        method: m,
                        headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded', 'Authentication':key}),
                        body: params
                    }).
                    then((response) => response.json()).
                    then((responseJson) => {
                        if (responseJson) {
                          //console.log("apiUrlaftercall",apiUrl);
                          //console.log('responseJson', responseJson);
                            if(stateName == 'agentDetails'){
                              this._formatAgent(responseJson.result)
                              if (this.props.screenProps.data.handleFullAPIReturn) {
                                  this.props.screenProps.data.handleFullAPIReturn(this.state.listingContact)
                              }
                            }else{
                                //console.log('responseJson',responseJson);
                                this.constructData = true;
                                this._constructData(responseJson.result)
                                this.setState({ developers: responseJson.developer[0] })
                                if(responseJson.agent) {
                                  this.setState({ agentData : responseJson.agent  })
                                }
                                this.getAmenities()
                                //this.setState({ result : responseJson.result })
                                
                            }
                        }
                    })
                    .catch((error) => {
                        console.log('error',error);
                    }); 
                } else {
                    fetch(apiUrl,
                    {
                        method: m,
                        headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'}),
                    }).
                    then((response) => response.json()).
                    then((responseJson) => {
                        //console.log('showInterval',responseJson.shortlist)
                        if (responseJson) {
                          if( stateName == 'pastTransactionDetail'){
                                this.setState({
                                  pastTransactionDetail : responseJson
                                });
                          }
                          else if( stateName=='nearbyListing'){
                                if(responseJson) {
                                    this.setState({
                                      nearbyListing : responseJson 
                                    });    
                                }
                          }  
                          else if(stateName=='relatedListing'){
                                if(responseJson && responseJson.property) {
                                   this.setState({
                                      relatedListing : responseJson.property 
                                    }); 
                                }
                                
                          }else if(stateName == 'agentDetails'){
                              //console.log('agentDetails',responseJson);
                              this._formatAgent(responseJson.result)
                             // if (this.props.screenProps.data.handleFullAPIReturn) {
                                //  this.props.screenProps.data.handleFullAPIReturn(this.state.listingContact)
                             // }
                          }else{
                                this.constructData = true
                                this._constructData(responseJson.result)
                                let mid = responseJson.result.mid?responseJson.result.mid:''
                                let nid = responseJson.result.nid?responseJson.result.nid:''
                                this.setState({ isShortListed: responseJson.shortlist, mid : mid , nid : nid })
                                
                            }
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                }
                
            }
        });
    }

    getAmenities() {
      this._callAmenitiesAPI(API_GET_AMENITIES+this.state.listingPriceInfo.lat+ '/' +this.state.listingPriceInfo.lng +'/2000' , "getAmenities");
    }
    

    _callAmenitiesAPI(apiUrl, stateName) {
      if (Platform.OS === 'ios') {
        this._sendAmenitiesAPIRequest(apiUrl, stateName);
      }
      else {
        NetInfo.isConnected.fetch().then(isConnected => {
          if (isConnected) {
             this._sendAmenitiesAPIRequest(apiUrl, stateName);
          }
        });
      }
    }


    _sendAmenitiesAPIRequest(apiUrl, stateName){
      //console.log('apiUrlamesities',apiUrl, stateName);
      var obj = [];
      var myArr = {};
      if (stateName != '') {
          fetch(apiUrl,
          {
              method: 'GET',
          }).
          then((response) => response.json()).
          then((responseJson) => {
            //console.log("responseJsonAmenties",responseJson);
              if (responseJson && stateName == 'getAmenities') {
                if(responseJson.length > 0) {
                  this.setState({ getAmenitiesValue : responseJson })
                }
              }
          })
          .catch((error) => {
              console.log(error);
          });
      }
    }

    mySavedSearch() {
      this.refs.navigationHelper._navigateInMenu("MySavedSearch", {
        data: this.state.userInfo,
        onGoBack: this.refresh
       })
    }

    refresh() {
      this.componentDidMount();
    }


    _details() {
        //console.log("this.params",this.params);
        let property_id = this.params.data.property_id;
        let type = this.params.data.key;
        let field_prop_listing_type = this.params.data.listing_type;
        let uid = this.params.data.uid;

        this._changeURL()
        let param = "&property_id="+property_id+"&field_prop_listing_type="+field_prop_listing_type+"&type="+type+"&uid="+uid;
        this._callAPI(this.featuredProjectDetailURL,param)
        //this._callAPI(this.getAmenities)

    }

    _changeURL() {
        let nid = this.params.data.nid
        this.featuredProjectDetailURL = API_FEATUREDPROJECTS_DETAILS
        //this.getAmenities = API_GET_AMENITIES
        //this.relatedListingURL = API_GET_RELATED_LISTING + encodeURIComponent('&nid=' + nid)
    }

    _sendAPIRequest(apiUrl, stateName){

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
            //console.log("responseJsonDetails",responseText);
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
                  let maxsale = responseJson.sale;
                  let maxrent = responseJson.rent;

                  /*if(maxsale.length > 2) {
                    maxsale = maxsale.slice(0, 2);
                  }

                  if (maxrent.length > 2) {
                    maxrent = maxrent.slice(0, 2);
                  }*/
                 

                  //this._formatResult(maxsale,'sale');
                 // this._formatResult(maxrent,'rent');
                  this.setState({
                    mainNewProjects : responseJson.editorsPick
                  })
                  
              } 

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
      
        let mapData = item.location_p?item.location_p.split(/\s*,\s*/):'';

        this.refs.navigationHelper._navigate('ListingDetailNav', {
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
                itemId: item.id?item.id:0
            },
            onGoBack: this.doNothing
        })
    }

    _formatResult(result,stateName){
        let response = [];
        for (var index = 0; index < result.length; index++) {
            let data = result[index];
            let item = {};
            let images = data.field_prop_images? (data.field_prop_images.und? data.field_prop_images.und: []) :[];
            item.images = [];
            images.map((img, index) => {
                if(img.list_uri){
                    item.images.push(img.list_uri);
                }
            });

            if(data.field_property_type.und && data.field_property_type.und[0].target_id == 36) {
                if(data.field_prop_land_area.und && data.field_prop_land_area.und[0].value != undefined ) {
                  item.total_sqft = data.field_prop_land_area.und[0].value; 
                  item.perSqft = data.field_prop_price_pu.und[0].value    
                }
                if(data.field_prop_built_up_sqft.und && data.field_prop_built_up.und[0].value != undefined) {
                  item.total_sqft = data.field_prop_built_up.und[0].value;    
                  item.perSqft = data.field_prop_built_up_price_pu.und[0].value
                }
            } 
            if(data.field_property_type.und && data.field_property_type.und[0].target_id != 36) {
                if(data.field_prop_built_up_sqft.und && data.field_prop_built_up.und[0].value != undefined) {
                  item.total_sqft = data.field_prop_built_up.und[0].value;    
                  item.perSqft = data.field_prop_built_up_price_pu.und[0].value
                }
                if(data.field_prop_land_area.und && data.field_prop_land_area.und[0].value != undefined ) {
                  item.total_sqft = data.field_prop_land_area.und[0].value; 
                  item.perSqft = data.field_prop_price_pu.und[0].value    
                }  
            }
           
            item.title = data.title;
            item.nid = data.nid;
            item.mid = data.mid;
            item.asking_price = data.field_prop_asking_price? (data.field_prop_asking_price.und? (data.field_prop_asking_price.und[0]? this._formatMoney(data.field_prop_asking_price.und[0].value): ''): '') : '';
            item.asking_slogan = data.field_listing_slogan? (data.field_listing_slogan.und? (data.field_listing_slogan.und[0]? this._formatMoney(data.field_listing_slogan.und[0].value): ''): '') : '';
            item.bedrooms = data.field_prop_bedrooms? (data.field_prop_bedrooms.und? (data.field_prop_bedrooms.und[0]? data.field_prop_bedrooms.und[0].value: 0): 0) : 0;
            item.bathrooms = data.field_prop_bathrooms? (data.field_prop_bathrooms.und? (data.field_prop_bathrooms.und[0]? data.field_prop_bathrooms.und[0].value: 0): 0) : 0;
            item.street = data.field_prop_street? (data.field_prop_street.und? (data.field_prop_street.und[0]? data.field_prop_street.und[0].value: '') : '') : '';
            item.tenure = this._tenureValue(data.field_prop_lease_term)
            item.postcode = data.field_prop_postcode? (data.field_prop_postcode.und? (data.field_prop_postcode.und[0]? data.field_prop_postcode.und[0].value: '') : '') : '';
            item.year_completed = data.field_completion_year? (data.field_completion_year.und? (data.field_completion_year.und[0]? (data.field_completion_year.und[0].value): ''): '') : '';
            item.land_area = data.field_prop_land_area? (data.field_prop_land_area.und? (data.field_prop_land_area.und[0]? data.field_prop_land_area.und[0].value: '') : '') : '';
            if(item.land_area)
                item.land_area = item.land_area.toString();
            item.property_id = (data.nid && data.nid >0)? data.nid: data.mid;
            item.listing_type = data.field_prop_listing_type.und[0].value;
            item.key = (data.nid && data.nid >0)? 'n': 'm';
            item.uid = data.uid;

            response.push(item);
        }

        this.setState({
            [stateName]: response
        });
    }

    _formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
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
          hintText: ''
         }
       })
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

       // firebase.analytics().logEvent('View_Listing', { id: item.nid });

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
                area: '',
                project: '',
                shortlisted: item.s_id?true: false,
                itemId: item.id?item.id:0,
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

      this.refs.navigationHelper._navigate('ExploreLanding', {
          data: {
            listing_type: 'sale',
            from: 'home'
          }
        })
    }

    render() {
     // console.log('dsfkdsfg gfj dflgj dflg dflg df', this.props.navigation.state);
      var icon = require('../../assets/icons/menu_more.png');
      var {height, width} = Dimensions.get('window')
      //console.log('stateDetails', this.state);
      const { facilitiesFeatures, listingInfo, listingPriceInfo, listingDescription, listingHighlight, listingKeyDetails, listingFacilities, listingFeatures, developers } = this.state;

      //let sliderImage = [];
      let Img = [];
      {listingHighlight && listingHighlight.images && (
        Img = listingHighlight.images.map((item) => {
            return {
              'uri' : item
            }
        })
      )}
      this.setState({ Img : Img })

      let propertyType = '';
      let iconType = '';
      let iconText = '';
      if (listingInfo.propertySubType && listingInfo.propertySubType != '') {
        if(listingInfo.propertySubType == 36) {
          iconType = require('../../assets/icons/landed.png');
          iconText = 'Landed';
        } else if(listingInfo.propertySubType == 33) { 
            iconType = require('../../assets/icons/non-land.png');
            iconText = 'Non-Landed';
        } else if(listingInfo.propertySubType == 60) { 
            iconType = require('../../assets/icons/store.png');
            iconText = 'Commercial';
        } else {
            iconType = require('../../assets/icons/factory.png');
            iconText = 'Industrial';
        }
      }

      let size = 5;
      let amenitiesSchoolType = [];
      let amenitiesMedicalType = [];
      let amenitiesShoppingType = [];
      let amenitiesBankType = [];
      let amenitiesRestaurantType = [];
      let amenities = this.state.getAmenitiesValue.map((item) => {
        if(item.type == "Schools") {
          amenitiesSchoolType.push(item.title+'\n');
          amenitiesSchoolType = amenitiesSchoolType.slice(0, size);
        } else if(item.type == "Clinics") {
          amenitiesMedicalType.push(item.title+'\n');
          amenitiesMedicalType = amenitiesMedicalType.slice(0, size);
        } else if(item.type == "Convenience Stores") {
          amenitiesShoppingType.push(item.title+'\n');
          amenitiesShoppingType = amenitiesShoppingType.slice(0, size);
        } else if(item.type == "Bank Branches") {
          amenitiesBankType.push(item.title+'\n');
          amenitiesBankType = amenitiesBankType.slice(0, size);
        } else {
          amenitiesRestaurantType.push(item.title+'\n');
          amenitiesRestaurantType = amenitiesRestaurantType.slice(0, size);
        }
      })

      //console.log("this.props",this.props);
      let facilitiesArray = [];
      let allFacilities = [];
      let facility = listingFacilities.data;
      let feature = listingFeatures.data;
      if(listingPriceInfo && listingPriceInfo.facilitiesValues) {
      let additionlAmenities = listingPriceInfo.facilitiesValues;
      facilitiesArray = additionlAmenities.split(',');
    }
      return (
          <View style={{ flex: 1 }}>
              <NavigationHelper
                    ref={"navigationHelper"}
                    navigation={this.props.navigation} />
              <AppStateChange/>
              {this.state.onRegister && (
                <PropmallRegisterModal  
                  closeModal={this._closeRegisterModal} 
                  agentData={this.state.agentData} 
                  mid={this.state.mid} 
                  nid={this.state.nid}/>
              )} 
                <ScrollView>
                  <View style={styles.propDetailHero}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack() } style={styles.backButton}>
                    <Image
                      style={{width: 20, height: 18}}
                      source={require('../../assets/icons/leftArrow.png')}
                    />
                    </TouchableOpacity>
                    <Text allowFontScaling={false} style={styles.propDetailHeroTitle}>{listingInfo.title}</Text>
                    <Text allowFontScaling={false} style={styles.propHeroDesc}>{listingPriceInfo.askingSlogan != '-' ? listingPriceInfo.askingSlogan : ''}</Text>
                    <View style={styles.socialWrapper}>
                      {/*<TouchableOpacity style={styles.detailSocialIcon}>
                        <Image
                          style={{width: 40, height: 40}}
                          source={require('../../assets/icons/fb.png')}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.detailSocialIcon}>
                        <Image
                          style={{width: 40, height: 40}}
                          source={require('../../assets/icons/twitter.png')}
                        />
                      </TouchableOpacity>*/}
                    </View>
                  </View>
                  <View>
                  <ImageBackground
                    source={{uri: listingPriceInfo.coverImage}}
                    resizeMode= 'cover'
                    style={styles.propDetailHeroImage}
                    >
                      {/*<TouchableOpacity>
                        <Image
                          style={{width: 175, height: 40}}
                          source={require('../../assets/icons/tuor_prop_label.png')}
                        />
                      </TouchableOpacity>*/}
                    </ImageBackground>
                  </View>
                  <View style={styles.hpMainContainer}>
                    <View style={styles.hpFirstSec}>
                      <View style={styles.propDetailDescWrap}>
                        <Text allowFontScaling={false} style={styles.propDetailDesc}>{listingDescription.info} </Text>
                        
                        <View style={styles.propTwoWay}>
                          <View>
                            <Image
                              style={{width: width * 0.2, height: width * 0.2 }}
                              source={{uri: (developers.logo == '' ? agentImage : developers.logo)}}
                            />
                          </View>
                          <View style={styles.propProviderContent}>
                            <Text allowFontScaling={false} style={styles.propProviderContentTitle}>{developers.name}</Text>
                            <Text allowFontScaling={false} style={styles.propProviderContentDesc}>{developers.about}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={styles.hpFirstSec}>
                      <View style={styles.sectionGallery}>
                        <View style={styles.sectionHeader}>
                          <Text allowFontScaling={false} style={styles.propSectionTitle}>Gallery</Text>
                        </View>
                        <ScrollView horizontal={true} bounces={false}>
                          <View style={styles.horizontalTrack}>

                          {this.state.Img.length > 0 && this.state.Img.map((item, i) => {
                            return(
                            <TouchableOpacity style={styles.galleryItem} key={i}>
                              <ImageBackground
                                source={{uri: item.uri}}
                                resizeMode= 'cover'
                                style={styles.galleryItemImage}>
                                {/*<View style={styles.galleryLabel}>
                                  <Text allowFontScaling={false} style={styles.galleryLabelText}>4.30</Text>
                                </View>*/}
                              </ImageBackground>
                            </TouchableOpacity>
                           )})}

                          </View>
                        </ScrollView>
                      </View>
                    </View>
                    <View style={styles.hpFirstSec}>
                      <View style={styles.sectionLocation}>
                        <View style={styles.sectionHeader}>
                          <Text allowFontScaling={false} style={styles.propSectionTitle}>Location</Text>
                        </View>
                        <View style={styles.sectionLocationContent}>
                          <View style={styles.propTwoWay}>
                            <View>
                              <Image
                                style={{width: 18, height: 26 }}
                                source={require('../../assets/icons/pin.png')}
                              />
                            </View>
                            <View style={styles.propProviderContent}>
                              <Text allowFontScaling={false} style={styles.propTwoWayContent}>{listingInfo.title + ',' + listingInfo.assetStreetName + ',' + listingInfo.assetDistrict + ',' + listingInfo.state + ',' + listingInfo.assetPostalCode}</Text>
                            </View>
                          </View>
                        </View>
                        {/*<View style={styles.propDetailDescWrap}>
                          <Text allowFontScaling={false} style={styles.propDetailDesc}></Text>
                        </View>*/}
                        {/*<ImageBackground
                          source={require('../../assets/images/Google-Map-malasia.png')}
                          resizeMode= 'cover'
                          style={styles.mapArea}>
                        </ImageBackground>*/}
                       
                        {((listingPriceInfo.lan != '' && listingPriceInfo.lat != '') || (listingPriceInfo.lan != null && listingPriceInfo.lat != null)) && (
                          <View style={{ height: Dimensions.get('window').height * 0.415}}>
                              <ListingDetailLocation destinations={this.state.getAmenitiesValue} navigation={this.props.navigation} showNearBy={false}/>
                          </View>
                        )}
                      </View>
                    </View>

                   
                    {(listingKeyDetails &&  Object.keys(listingKeyDetails).length >0) && (
                    <View style={styles.hpFirstSec}>
                      <View style={styles.sectionFeatures}>
                        <View style={styles.sectionHeader}>
                          <Text allowFontScaling={false} style={styles.propSectionTitle}>Features</Text>
                        </View>
                        <View style={styles.propDetailDescWrap}>
                          {listingKeyDetails.asset_tenure != "" && (
                          <View style={styles.propTwoWay}>
                            <View style={styles.propListIcon}>
                              <Image
                                style={{width: 20, height: 24 }}
                                source={require('../../assets/icons/p-list.png')}
                              />
                            </View>
                            <View style={styles.propProviderContent}>
                              <Text allowFontScaling={false} style={styles.propTwoWayList}>{listingKeyDetails.asset_tenure}</Text>
                            </View>
                          </View>
                          )}
                          {listingKeyDetails.size  != ""&& (
                          <View style={styles.propTwoWay}>
                            <View style={styles.propListIcon}>
                              <Image
                                style={{width: 22, height: 23 }}
                                source={require('../../assets/icons/p-area.png')}
                              />
                            </View>
                            <View style={styles.propProviderContent}>
                              <Text allowFontScaling={false} style={styles.propTwoWayList}>From {listingKeyDetails.size + ' ' + listingKeyDetails.sizeUnit}</Text>
                            </View>
                          </View>
                          )}
                          {listingKeyDetails.top != "" && (
                          <View style={styles.propTwoWay}>
                            <View style={styles.propListIcon}>
                              <Image
                                style={{width: 22, height: 22 }}
                                source={require('../../assets/icons/p-cap.png')}
                              />
                            </View>
                            <View style={styles.propProviderContent}>
                              <Text allowFontScaling={false} style={styles.propTwoWayList}>Completion Year: {listingKeyDetails.top}</Text>
                            </View>
                          </View>
                          )}
                          
                          <View style={styles.propTwoWay}>
                            <View style={styles.propListIcon}>
                              <Image
                                style={{width: 22, height: 22 }}
                                source={iconType}
                              />
                            </View>
                            <View style={styles.propProviderContent}>
                              <Text allowFontScaling={false} style={styles.propTwoWayList}>{iconText}</Text>
                            </View>
                          </View>
                         
                          {listingPriceInfo.askingPrice != "" && (
                          <View style={styles.propTwoWay}>
                            <View style={styles.propListIcon}>
                              <Image
                                style={{width: 28, height: 16 }}
                                source={require('../../assets/icons/p-money.png')}
                              />
                            </View>
                            <View style={styles.propProviderContent}>
                              <Text allowFontScaling={false} style={styles.propTwoWayList}>{'FROM '+this._formatMoney(listingPriceInfo.askingPrice)}</Text>
                            </View>
                          </View>
                          )}
                          {listingKeyDetails.landSize != '-' && (
                          <View style={styles.propTwoWay}>
                            <View style={styles.propListIcon}>
                              <Image
                                style={{width: 23, height: 24 }}
                                source={require('../../assets/icons/p-cube.png')}
                              />
                            </View>
                            <View style={styles.propProviderContent}>
                              <Text allowFontScaling={false} style={styles.propTwoWayList}>From {listingKeyDetails.landSize + ' ' + listingKeyDetails.sizeUnit}</Text>
                            </View>
                          </View>
                        )}
                        </View>
                      </View>
                    </View>
                    )}

                    {(listingFacilities.data && listingFacilities.data.length > 0) &&
                        <View style={styles.hpFirstSec}>
                          <View style={styles.sectionFacilities}>
                            <View style={styles.sectionHeader}>
                              <Text allowFontScaling={false} style={styles.propSectionTitle}>Facilities</Text>
                            </View>
                            <View style={styles.propDetailDescWrap}>
                            {facilitiesArray.map((item) => {
                              return(
                                <View style={styles.propTwoWay}>
                                  <View style={styles.propListIcon}>
                                    <Image
                                      style={{width: 20, height: 14, marginTop: 1 }}
                                      source={require('../../assets/icons/p-check.png')}
                                    />
                                  </View>
                                  <View style={styles.propProviderContent}>
                                    <Text allowFontScaling={false} style={styles.propTwoWayList}>{item}</Text>
                                  </View>
                                </View>
                              )
                            })}
                            </View>
                          </View>
                        </View>
                      }
                    
                    <View style={styles.hpFirstSec}>  
                      <View style={styles.sectionAmenities}>
                      {amenitiesSchoolType != '' && amenitiesMedicalType != '' && amenitiesShoppingType != '' && (amenitiesBankType != '' || amenitiesRestaurantType != '') &&
                        <View style={styles.sectionHeader}>
                          <Text allowFontScaling={false} style={styles.propSectionTitle}>Amenities</Text>
                        </View>
                      }
                        <View style={styles.propDetailDescWrap}>

                          {amenitiesSchoolType != '' &&
                            <View style={styles.propTwoWay}>
                              <View style={styles.propListIcon}>
                                <Image
                                  style={{width: 20, height: 24, marginTop: 1 }}
                                  source={require('../../assets/icons/p-list.png')}
                                />
                              </View>
                              <View style={styles.propProviderContent}>
                                <Text allowFontScaling={false} style={styles.propTwoWayListHead}>Education</Text>
                                <Text allowFontScaling={false} style={styles.propTwoWayList}>{amenitiesSchoolType}</Text>
                              </View>
                            </View>
                          }

                          {amenitiesMedicalType != '' &&
                            <View style={styles.propTwoWay}>
                              <View style={styles.propListIcon}>
                                <Image
                                  style={{width: 26, height: 24, marginTop: 1 }}
                                  source={require('../../assets/icons/p-heart.png')}
                                />
                              </View>
                              <View style={styles.propProviderContent}>
                                <Text allowFontScaling={false} style={styles.propTwoWayListHead}>Medical</Text>
                                <Text allowFontScaling={false} style={styles.propTwoWayList}>{amenitiesMedicalType}</Text>
                              </View>
                            </View>
                          }

                          {amenitiesShoppingType != '' &&
                            <View style={styles.propTwoWay}>
                              <View style={styles.propListIcon}>
                                <Image
                                  style={{width: 26, height: 25, marginTop: 1 }}
                                  source={require('../../assets/icons/p-car.png')}
                                />
                              </View>
                              <View style={styles.propProviderContent}>
                                <Text allowFontScaling={false} style={styles.propTwoWayListHead}>Shopping</Text>
                                <Text allowFontScaling={false} style={styles.propTwoWayList}>{amenitiesShoppingType}</Text>
                              </View>
                            </View>
                          }

                          {amenitiesBankType != '' &&
                            <View style={styles.propTwoWay}>
                              <View style={styles.propListIcon}>
                                <Image
                                  style={{width: 26, height: 26, marginTop: 1 }}
                                  source={require('../../assets/icons/p-more.png')}
                                />
                              </View>
                              <View style={styles.propProviderContent}>
                                <Text allowFontScaling={false} style={styles.propTwoWayListHead}>Bank</Text>
                                <Text allowFontScaling={false} style={styles.propTwoWayList}>{amenitiesBankType}</Text>
                              </View>
                            </View>
                          }

                          {(amenitiesBankType == '' || amenitiesShoppingType == '' || amenitiesMedicalType == '' || amenitiesSchoolType == '') &&
                            <View style={styles.propTwoWay}>
                              <View style={styles.propListIcon}>
                                <Image
                                  style={{width: 26, height: 26, marginTop: 1 }}
                                  source={require('../../assets/icons/p-more.png')}
                                />
                              </View>
                              <View style={styles.propProviderContent}>
                                <Text allowFontScaling={false} style={styles.propTwoWayListHead}>Restaurants</Text>
                                <Text allowFontScaling={false} style={styles.propTwoWayList}>{amenitiesRestaurantType}</Text>
                              </View>
                            </View>
                          }

                        </View>
                      </View>
                    </View>
                    {this.state.floorPlan && this.state.floorPlan.length > 0 && (
                      <View style={styles.hpFirstSec}>
                        <PropMallSwiper onInterested={this._handleRegister} propertyTypes={this.state.floorPlan} />
                      </View>
                    )}
                    
                </View>
                 {/*} <View style={styles.sectionRelatedProps}>
                    <View style={styles.sectionHeader}>
                      <Text allowFontScaling={false} style={styles.propSectionTitle}>Other Projects of this Developer</Text>
                    </View>
                    <ScrollView horizontal={true} bounces={false}>
                      <View style={styles.horizontalTrack}>
                        <TouchableOpacity style={styles.propertyItem}>
                          <ImageBackground
                            source={require('../../assets/images/prop-2.png')}
                            resizeMode= 'cover'
                            style={styles.propertyItemImage}
                          >
                            <View style={styles.propOverlay}>
                              <Text allowFontScaling={false} style={styles.discoverTitle}>SELANGOR</Text>
                            </View>
                          </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.propertyItem}>
                          <ImageBackground
                            source={require('../../assets/images/prop-4.png')}
                            resizeMode= 'cover'
                            style={styles.propertyItemImage}
                          >
                            <View style={styles.propOverlay}>
                              <Text allowFontScaling={false} style={styles.discoverTitle}>SELANGOR</Text>
                            </View>
                          </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.propertyItem}>
                          <ImageBackground
                            source={require('../../assets/images/prop-3.png')}
                            resizeMode= 'cover'
                            style={styles.propertyItemImage}
                          >
                            <View style={styles.propOverlay}>
                              <Text allowFontScaling={false} style={styles.discoverTitle}>SELANGOR</Text>
                            </View>
                          </ImageBackground>
                        </TouchableOpacity>
                      </View>
                    </ScrollView>
                  </View> */}
                </ScrollView>
                <View style={styles.propFixedBar}>
                  <Image
                      style={{width: 45, height: 40}}
                      source={require('../../assets/icons/propmall-icon.png')}
                    />
                    <TouchableOpacity onPress={this._handleRegister} style={styles.regButton}>
                      <Text allowFontScaling={false} style={styles.regButtonText}>Enquire Now</Text>
                    </TouchableOpacity>
                </View>
                {(this.state.listingKeyDetails.length==0)?
                  <Loading/>:
                  <View/>
                }
          </View>
        )
    }
}

export default PropMall
