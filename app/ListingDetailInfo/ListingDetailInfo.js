import React, { Component } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Alert,
    ScrollView,
    Image,
    Dimensions,
    TouchableHighlight,
    TouchableOpacity,
    NetInfo,
    AsyncStorage,
    PixelRatio
} from 'react-native'
import {HeaderBackButton} from 'react-navigation';
import firebase from 'react-native-firebase';
import appsFlyer from 'react-native-appsflyer';
import RNFetchBlob from "react-native-fetch-blob";
import Share from 'react-native-share';
import IconMenu from '../../components/Common_IconMenu/Common_IconMenu.js'
import LandingHighlight from '../../components/Common_LandingHighlight/Common_LandingHighlight.js'
import ListingPriceInfo from '../../components/Listing_PriceInfo/Listing_PriceInfo.js'
import ListingInfo from '../../components/Listing_ListingInfo/Listing_ListingInfo.js'
import ListingDescription from '../../components/Listing_Description/Listing_Description.js'
import ImageSlider from '../../components/Common_Swiper/Common_Swiper.js'
import Listing_KeyDetails from '../../components/Listing_KeyDetails/Listing_KeyDetails.js'
import Common_Contact from '../../components/Common_Contact/Common_Contact.js'
import Common_Button from '../../components/Common_Button/Common_Button.js'
import Common_ListIconMenu from '../../components/Common_ListIconMenu/Common_ListIconMenu.js'
import ListingResult_List from '../../components/ListingResult_List/ListingResult_List.js'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import Loading from '../../components/Common_Loading/Common_Loading.js'
import RelatedProperty_List from '../../app/RelatedProperty_List/RelatedProperty_List.js'
import TenureOptions from '../../assets/json/Search_Data/TenureOptions.json'
import TypeOptions from '../../assets/json/Search_Data/TypeOptions.json'
import DistrictOptions from '../../assets/json/Search_Data/DistrictOptions.json'
import PropertyTypeOptions from '../../assets/json/Search_Data/PropertyTypeOptions.json'
import Features from '../../assets/json/Features.json'
import Fittings from '../../assets/json/Fittings.json'
import Space from '../../assets/json/Space.json'
import ShareHelper from '../../components/Common_ShareHelper/Common_ShareHelper.js'
import ListingDetailLocation from '../../app/ListingDetailLocation/ListingDetailLocationNav';
import Past_TransactionDetail from '../../components/Past_TransactionDetail/Past_TransactionDetail.js'
import WishList from '../../app/WishlistModal/WishlistModal.js'
import MultiTapHandler from '../../app/MultipleTapHandler/MultiTapHandler.js'
import Home_List from '../../components/Home_List/Home_List'
import moment from 'moment'; 
import BookmarkHelper from '../../components/Common_BookmarkHelper/Common_BookmarkHelper.js'

const HOSTNAME = "https://prolex.edgeprop.my";
const PROXY_URL = "";
const API_DOMAIN1 = "/api/v1/findAgent";
const API_DOMAIN_2 = "/api/v1/fetchOne";
const API_GET_AGENT_DETAIL = HOSTNAME + PROXY_URL + API_DOMAIN1;
const API_GET_LISTING_DETAILS_FULL = HOSTNAME + PROXY_URL + API_DOMAIN_2;
//const API_GET_RELATED_LISTING = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN_2 + "/listings/getrelatedlistings?");
//const API_GET_NEARBY_LISTING = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN_2 + "/listings/getnearbylistings?");
const TIMEOUT = 1000;
const API_GET_RELATED_LISTING = "https://www.edgeprop.my/jwdsonic/api/v1/property/similar-property/n/";
const API_GET_NEARBY_LISTING = "https://www.edgeprop.my/getAmenitiesNearBy/";
const API_PAST_TRANSACTION_WITH_PROJECT = "https://edgeprop.my/jwdalice/api/v1/transactions/details";
const API_PAST_TRANSACTION_WITHOUT_PROJECT = "https://edgeprop.my/jwdalice/api/v1/transactions/search";

class ListingDetailInfo extends Component {
    didMount
    constructData
    showIndex
    sliderGallery
    constructor(props) {
        super(props)
        this.navigation = props.navigation
        this.params = this.navigation.state.params
        this.state = {
            listingHighlight: {},
            floorPlanImage: {},
            listingPriceInfo: {},
            listingInfo: {},
            listingDescription: {},
            listingKeyDetails: {},
            listingContact: {},
            listingFeatures: {},
            listingFacilities: {},
            listingInOutSpace: {},
            relatedListing: [],
            nearbyListing: [],
            pastTransactionDetail: [],
            userInfo: {},
            isShortListed: false,
            shareUrl: '',
            bookmarkNid: 0,
            bookmarkMid:0,
            onPressBookmark: false,
            reRender: false,
            containerHeight: 800
        }
        this.category = {
            '33' : 'RESIDENTIAL',
            '36' : 'RESIDENTIAL',
            '60 ' : 'COMMERCIAL',
            '70' : 'INDUSTRIAL'
        }
        var { height, width } = Dimensions.get('window')
        this.screenWidth = width,
        this.screenHeight = height
        this.listingDetailURL = ''
        this.showAgent = true;
        this.tagged = false;
        this._callAPI = this._callAPI.bind(this);
        this._getLabel = this._getLabel.bind(this);
        this._handleCollection = this._handleCollection.bind(this);
        this._prefixType = this._prefixType.bind(this);
        this._handleOnPressListing = this._handleOnPressListing.bind(this);
        this._handleBackPress = this._handleBackPress.bind(this);
        this.checkShortList = this.checkShortList.bind(this);
        this._shareItem = this._shareItem.bind(this)
        this._shareHandler = this._shareHandler.bind(this)
        this._shareImage = this._shareImage.bind(this)
        this.doNothing = this.doNothing.bind(this)
        this.addToShortList = this.addToShortList.bind(this)
        this.removeShortList = this.removeShortList.bind(this)
        this.closeWishlistModal = this.closeWishlistModal.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.calculateHeight = this.calculateHeight.bind(this)
        this.resetUsrInfo = this.resetUsrInfo.bind(this)
    }

    async addToShortList() {
        await this.resetUsrInfo();
        if(this.state.userInfo.uid == 0) {
            if(this.refs.bookmarkHelper != undefined){
            this.refs.bookmarkHelper._checkLogin(
                ()=>{
                    this.state.isLogin = true;
                    if(this.state.isLogin){
                        this.refs.menu._toggleMenu()
                        this.setState({
                          isBookmark: this.state.isBookmark ? false : true
                        })
                    this.refs.bookmarkHelper._updateBookmark(this.props.nid, this.state.isBookmark, this._checkBookmark)
                    }
                },
                ()=>{
                    // console.log('ian 12345');
                    // this.refs.bookmarkHelper._updateBookmark(this.props.nid, !this.state.isBookmark, this._checkBookmark)
                    this.refs.navigationHelper._navigate('SignUpLanding', {
                      data: {},
                      _handleBack: this._handleBack,
                      _handleClose: this._handleClose
                    })
                }
            )
            // if(this.state.isLogin){
            //     this.refs.menu._toggleMenu()
            //     this.setState({
            //       isBookmark: this.state.isBookmark ? false : true
            //     })
            //     if(this.refs.bookmarkHelper != undefined){
            //         this.refs.bookmarkHelper._updateBookmark(this.props.nid, !this.state.isBookmark, this._checkBookmark)
            //     }
            // }
        }
        } else {
            let mid = this.props.navigation.state.params.data.mid?this.props.navigation.state.params.data.mid:''
            let nid = this.props.navigation.state.params.data.nid?this.props.navigation.state.params.data.nid:''
            this.setState({ bookmarkMid : mid , bookmarkNid: nid , onPressBookmark: true })
        }
    }

    removeShortList() {
        let mid = this.props.navigation.state.params.data.mid?this.props.navigation.state.params.data.mid:''
        let nid = this.props.navigation.state.params.data.nid?this.props.navigation.state.params.data.nid:''
        this.setState({ bookmarkMid : mid , bookmarkNid: nid , onPressBookmark: true })
    }

    _shareItem(){
      if(this.state.shareUrl != '') {
        //console.log('https://www.edgeprop.my/listing/'+this.state.shareUrl.replace(/^"(.*)"$/, '$1'));
        this.refs.share._share('https://www.edgeprop.my/listing/'+this.state.shareUrl.replace(/^"(.*)"$/, '$1'));
      }
    }

    _shareHandler(index){
        console.log('_shareHandler', index);
        this.showIndex = index
        MultiTapHandler(this._shareImage(index), 1000)
    }

    _shareImage(index){
        let url = '';
        let type = 'image/jpeg';
        if(this.sliderGallery.length> index){
            url = this.sliderGallery[index].image;
        }else{
            return;
        }
        if(url.includes(".jpeg?") || url.includes(".jpg?")){
            type = 'image/jpeg';
        }else if(url.includes(".png?")){
            type = 'image/png';
        }else if(url.includes(".gif?")){
            type = 'image/gif';
        }else if(url.includes(".webp?")){
            type = 'image/webp';
        }
        const fs = RNFetchBlob.fs;
        let imagePath = null;
        RNFetchBlob.config({
          fileCache: true
        })
          .fetch("GET", url)
          // the image is now dowloaded to device's storage
          .then(resp => {
            // the image path you can use it directly with Image component
            imagePath = resp.path();
            return resp.readFile("base64");
          })
          .then(async base64Data => {
            // here's base64 encoded image
            var base64Image = `data:`+type+`;base64,` + base64Data;
            await Share.open({ url: base64Image });
            // remove the file from storage
            return fs.unlink(imagePath);
          });
    }

    handleChange(val,length) {
        //console.log('ds',length);
        if(length > 0) {
            this.setState({ isShortListed : true })
            this.props.onShortlistChange(true)
        } else {
            this.setState({ isShortListed : false })
            this.props.onShortlistChange(false)
        }
        
    }

    async componentDidMount() {
      const auth = await AsyncStorage.getItem("authUser");
      if(auth && auth != '') {
        let authItems = JSON.parse(auth);
      //  console.log(authItems)
        if(authItems.status == 1) {
          this.setState({ userInfo: authItems },()=>this.onLoad())
        }  
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
      
    onLoad() {
        this.didMount = true
        //console.log('pass values',this.params.data);
        let property_id = this.params.data.property_id;
        let key = this.params.data.key;
        let listing_type = this.params.data.listing_type;
        let uid = this.params.data.uid;
        let nid = this.params.data.nid;
        let lat = this.params.data.lat;
        let lan = this.params.data.lan;
        let project = this.params.data.project;
        let state = this.params.data.state;
        let area = this.params.data.area;
        let newLaunch = this.params.data.newLaunch

        this._changeURL()
        let param = "type="+key+"&property_id="+property_id+"&new_launch="+newLaunch+"&field_prop_listing_type="+listing_type+"&cache=0";
        this._callAPI(this.listingDetailURL,param)

        relatedListingURL = API_GET_RELATED_LISTING+nid ;
        this._callAPI(relatedListingURL, '', 'relatedListing','GET')
        
        if(uid){
            let params = "uid="+uid;
            this._callAPI(API_GET_AGENT_DETAIL, params, 'agentDetails','POST')
        }

        nearbyListingURL = API_GET_NEARBY_LISTING+lat+'/'+lan+'/2000';
        this._callAPI(nearbyListingURL, '', 'nearbyListing', 'GET')
        
    }

    checkShortList(data) {
        this.setState({ isShortListed: data.shortlist }, ()=>this.props.handleRemove(data.shortlist))
        if(typeof data.shortlist != undefined) {
            this.props.onShortlistChange(data.shortlist);
        }
    }

    componentWillUnmount(){
      this.didMount = false
    }

    _handleBackPress() {
      this.props.navigation.goBack()
      this.props.navigation.state.params.onGoBack()
      this.props.handleRemove()
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
            prefix = 'l-';
        }else if(60<id || id<70){
            prefix = 'c-';
        }else if(70<id || id<74){
            prefix = 'i-';
        }
        //console.log('prefix',prefix);
        return prefix+id;
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if(JSON.stringify(nextProps.screenProps.data.bookmarkList) != JSON.stringify(this.props.screenProps.data.bookmarkList)){
    //       return true
    //     }
    //     return (JSON.stringify(nextState) != JSON.stringify(this.state))
    // }

    _formatAgent(result){
        if(result) {
            let listingContact = {};

            let property_id = this.params.data.property_id;
            let key = this.params.data.key;
            let listing_type = this.params.data.listing_type;
            let url = "https://www.edgeprop.my/listing/";
            if(key == 'm'){
                url += listing_type+'/'+property_id;
            }else{
                    url += property_id;
            }
            //console.log('url',url);

            if(result.data && result.data.length > 0){
                //console.log('user data ',result.data[0].user);
                var agent = result.data[0].agent;
                var main = result.data[0].main;
                var user = result.data[0].user;
                var imageDomain = result.agent_image_url+'/';
                var image = agent.field_agent_image? (agent.field_agent_image.und? (agent.field_agent_image.und[0]? agent.field_agent_image.und[0].uri: '') : '') : ''
                    image = image.replace('public://',imageDomain)
                if(user.name !== '911911911' && user.uid !== '65632'){
                    this.showAgent = true;
                }else{
                    this.showAgent = false;
                }
                listingContact = {
                    name: agent.field_agent_bizname? (agent.field_agent_bizname.und? (agent.field_agent_bizname.und[0]? agent.field_agent_bizname.und[0].value: '') : '') : '',
                    agencyName: agent.field_agent_agency? (agent.field_agent_agency.und? (agent.field_agent_agency.und[0]? agent.field_agent_agency.und[0].value: '') : '') : '',
                    phoneNumber: main.field_profile_contact? (main.field_profile_contact.und? (main.field_profile_contact.und[0]? main.field_profile_contact.und[0].value: '') : '') : '',
                    regNumber: agent.field_agent_id? (agent.field_agent_id.und? (agent.field_agent_id.und[0]? agent.field_agent_id.und[0].value: '') : '') : '',
                    image: image,
                    url: url
                }
                //console.log('listingContact',listingContact);
            }

            if(this.didMount){
              this.setState({
                  listingContact: listingContact,
              })
            }
        }
    }
    _handleCollection(key,collection) {
        let temp = []
        for (i = 0; i < collection.length; i++) {
            temp = [...temp, ...collection[i][key].map(data => data)];
        }
        return temp
    }

    doNothing() {
      console.log('ref'); 
    }

    _constructData(result) {
            let change_date = '';
            if(result.changed) {
                change_date = new Date(result.changed * 1000)
                
            }
            //console.log('result', result)
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


            var imagesA = result.field_prop_images? (result.field_prop_images.und? result.field_prop_images.und : []) : [];
            var images = imagesA.map((obj, i) => {
                    return obj['list_uri']
                })
            var gallery = imagesA.map((obj, i) => {
              return obj['gallery_uri']
            })
       // console.log('images',images);
            let listingHighlight = {
                images: images,
                gallery: gallery
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
                fairValue: result.fair_value? result.fair_value: '',
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
                assetDistrict: result.district,
                assetStreetName: result.field_prop_street? (result.field_prop_street.und? (result.field_prop_street.und[0] ? result.field_prop_street.und[0].value : ''): '') : '',
                assetPostalCode: result.field_prop_postcode? (result.field_prop_postcode.und? (result.field_prop_postcode.und[0] ? result.field_prop_postcode.und[0].value : ''): '') : '',
                assetCity: result.state,
                propertyType: result.field_property_type? (result.field_property_type.und? (result.field_property_type.und[0] ? result.field_property_type.und[0].target_id : ''): '') : '',
                propertySubType: subTypeLabel,
                floorLocation: result.field_prop_floor_location? (result.field_prop_floor_location.und? (result.field_prop_floor_location.und[0] ? result.field_prop_floor_location.und[0].value : ''): '') : '',
                assetYearCompleted: result.field_completion_year? (result.field_completion_year.und? (result.field_completion_year.und[0] ? result.field_completion_year.und[0].value : ''): '') : '',
                assetTenure: tenure,
                bedrooms: result.field_prop_bedrooms? (result.field_prop_bedrooms.und? (result.field_prop_bedrooms.und[0] ? result.field_prop_bedrooms.und[0].value : ''): '') : '',
                bathrooms: result.field_prop_bathrooms? (result.field_prop_bathrooms.und? (result.field_prop_bathrooms.und[0] ? result.field_prop_bathrooms.und[0].value : ''): '') : '',
                pricepu: result.field_prop_built_up_price_pu? (result.field_prop_built_up_price_pu.und? (result.field_prop_built_up_price_pu.und[0] ? result.field_prop_built_up_price_pu.und[0].value : ''): '') : '',
                landArea: result.field_prop_built_up? (result.field_prop_built_up.und? (result.field_prop_built_up.und[0] ? result.field_prop_built_up.und[0].value : ''): '') : '',
                landAreaUnit: result.field_prop_built_up_unit? (result.field_prop_built_up_unit.und? (result.field_prop_built_up_unit.und[0] ? result.field_prop_built_up_unit.und[0].value : ''): '') : '',
                furnished: result.field_prop_furnished? (result.field_prop_furnished.und? (result.field_prop_furnished.und[0] ? result.field_prop_furnished.und[0].value : ''): '') : '',
                changed: result.changed
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
                features = features.map((obj, i) => {
                    return {key:obj.value,value:this._getLabel(obj.value,Features)};
                })
            let facilities = result.field_prop_fixtures_fittings? (result.field_prop_fixtures_fittings.und? result.field_prop_fixtures_fittings.und : []) : [];
                facilities = facilities.map((obj, i) => {
                    return {key:obj.value,value:this._getLabel(obj.value,Fittings)};
                })
            let inOutSpace = result.field_prop_inout_space? (result.field_prop_inout_space.und? result.field_prop_inout_space.und : []) : [];
                inOutSpace = inOutSpace.map((obj, i) => {
                    return {key:obj.value,value:this._getLabel(obj.value,Space)};
                })
            let shareUrl = result.url?result.url:''    
            //console.log('facilities',facilities);
            listingFeatures = { data: features}
            listingFacilities = { data: facilities}
            listingInOutSpace = { data: inOutSpace}

            if(this.didMount){
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
              this.props.onBottomNavChange(true);
              this.constructData = true
            }   
    }

    _callPastTransactions(result){
        let listingType = result.field_prop_listing_type? (result.field_prop_listing_type.und? (result.field_prop_listing_type.und[0] ? result.field_prop_listing_type.und[0].value : ''): '') : '';
        
        if(listingType != 'rental') {
            let category = result.field_property_type? (result.field_property_type.und? result.field_property_type.und : []) : [];
            category.map((obj, i) => {
                if (obj.target_id in this.category)
                    category = this.category[obj.target_id];
            });
            if(category.length == 0) {
                category = 'RESIDENTIAL';
            }

            let state= result.state;
            let key = this.state.userInfo.accesskey;
            let area= result.district;
            let pastApiUrl = API_PAST_TRANSACTION_WITHOUT_PROJECT;
            
            let project = result.asset? (result.asset.project_name? result.asset.project_name: '') : '';
            let pastTransactionParams = "?state="+state+"&area="+encodeURIComponent(area)+"&category="+category+"&orderby=contract_date&sortby=desc&page=1";
            if(project != '') {
                this.tagged = true;
                pastApiUrl = API_PAST_TRANSACTION_WITH_PROJECT;
                pastTransactionParams +="&project="+project;
            }
            
            this._callAPI(pastApiUrl+pastTransactionParams, '', 'pastTransactionDetail','GET');
        }
        
    }

    _callAPI(apiUrl, params, stateName,method) {
       // console.log(apiUrl, params)
    let key = this.state.userInfo.accesskey    
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
                            //console.log('responseJson ', responseJson);
                            if(stateName == 'agentDetails'){
                              //console.log('agentDetails',responseJson.result);
                              this._formatAgent(responseJson.result)
                              if (this.props.screenProps.data.handleFullAPIReturn) {
                                  this.props.screenProps.data.handleFullAPIReturn(this.state.listingContact)
                              }
                            }else{
                                //console.log('responseJson', responseJson);
                                this.constructData = true
                                this.checkShortList(responseJson);
                                this._constructData(responseJson.result);
                                this._callPastTransactions(responseJson.result);
                            }
                        }
                    })
                    .catch((error) => {
                        console.log('error');
                    }); 
                } else {

                    fetch(apiUrl,
                    {
                        method: m,
                        headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'}),
                    }).
                    then((response) => response.json()).
                    then((responseJson) => {
                        //console.log('responseJson ', responseJson);
                        //console.log('showInterval',responseJson.shortlist)
                        if (responseJson) {
                          if( stateName == 'pastTransactionDetail'){
                                //console.log(responseJson);
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
                                   /*this.setState({
                                      relatedListing : responseJson.property 
                                    }); */
                                    //console.log('relatedListing', responseJson.property)
                                    this._formatResult(responseJson.property,'relatedListing');
                                }
                                
                          }else if(stateName == 'agentDetails'){
                              //console.log('agentDetails',responseJson);
                              this._formatAgent(responseJson.result)
                             // if (this.props.screenProps.data.handleFullAPIReturn) {
                                //  this.props.screenProps.data.handleFullAPIReturn(this.state.listingContact)
                             // }
                          }else{
                                //console.log('responseJson123',stateName);
                                this.constructData = true
                                this._constructData(responseJson.result)
                                
                                this.setState({ isShortListed: responseJson.shortlist })
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


    _formatResult(result,stateName){
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
            item.bedrooms = data.field_prop_bedrooms_i == 0? data.field_prop_bedrooms_i : data.field_prop_bedrooms_i? data.field_prop_bedrooms_i : -1;
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

        //console.log('response', response);
        this.setState({
            [stateName]: response
        });
    }

    _formatMoney(val) {
        return val ? 'RM ' + this._formatNumber(val) : '-'
    }

    _formatNumber(num) {
        if(num) {
          return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.screenProps.data.shortlist != undefined && nextProps.screenProps.data.shortlist != this.state.isShortListed) {
            this.setState({isShortListed: nextProps.screenProps.data.shortlist});
        }
    }
    _changeURL() {
        let nid = this.params.data.nid
        this.listingDetailURL = API_GET_LISTING_DETAILS_FULL
        //this.relatedListingURL = API_GET_RELATED_LISTING + encodeURIComponent('&nid=' + nid)
    }

    _wrapHighlightData(images) {
        if (!images) return []
        let wrappedImages = images.map(function (item) {
            return { image: item }
        })

        return wrappedImages
    }

    _isArrayContain(array, item){
      if(array!= undefined && Array.isArray(array)){
        if(item!=undefined && array.indexOf(item.toString()) > -1){
          return true
        }
        else{
          return false
        }
      }
    }

    _mapListing(stateName){
        return(
            this.state[stateName].map((listing,index)=>{
                return(
                    {
                    listing_id:listing.nid,
                    agent_name: listing.name,
                    agent_photo: listing.agent_image,
                    images: listing.images,
                    asking_price: listing.asking_price,
                    title: listing.title,
                    bedrooms: listing.bedrooms,
                    bathrooms: listing.bathrooms,
                    district_name: listing.asset_district,
                    street_name: listing.field_prop_street_value,
                    floor_area_sqft: listing.price_pu,
                    floor_area_sqm: listing.land_area,
                }
                )
            })
        );
    }

    closeWishlistModal() {
        this.setState({ onPressBookmark: false , bookmarkNid: 0, bookmarkMid: 0 })
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
                newLaunch:this.params.data.newLaunch
            },
            onGoBack: this.doNothing
        }) 
    }

    calculateHeight(items){
 
        let count = items.length? items.length : Object.keys(items).length;
        const size = 55;//PixelRatio.getPixelSizeForLayoutSize(85);
        let containerHeight = 400;
        if(count >0){
            
            containerHeight = count*size;
            containerHeight = containerHeight+450;
        }

        console.log("containerHeight",containerHeight);


        this.containerHeight = containerHeight;

        this.setState({
            containerHeight: containerHeight
        })
    }

    render() { 
        
        var _renderSlideShow = () => {
            var slideShowData = []
            var sliderGallery = []
            let listingHighlight = this.state.listingHighlight
            let floorPlanImage = this.state.floorPlanImage
            //console.log('listingHighlight', listingHighlight);
            if (listingHighlight.images != undefined && listingHighlight.images.length > 0) {
                slideShowData = listingHighlight.images.map((item, index) => {
                    return {
                        image: item || "",
                        title: "",
                        description: ""
                    }
                })
                sliderGallery = listingHighlight.gallery.map((item, index) => {
                    return {
                        image: item || "",
                        title: "",
                        description: ""
                    }
                })
                if(floorPlanImage.images != undefined && floorPlanImage.images.length > 0){
                    floorPlanImage.images.map((item, index) => {
                        var obj={}
                        obj["image"] = item || ""
                        obj["title"] = ""
                        obj["description"] = ""

                        slideShowData.push(obj)
                    })
                }
            }
            else{
                if(this.constructData){
                    slideShowData = [{image: "https://dkc9trqgco1sw.cloudfront.net/s3fs-public/default_images/no_img.png", title: "", description: ""}]
                } 
            }

            this.sliderGallery = sliderGallery;
  
            return (

                <View style={{ position: 'relative' }}>
                {slideShowData.length > 0 && (
                    <ImageSlider 
                      width={this.screenWidth}
                      height={this.screenWidth * 9 / 16}                
                      data = {slideShowData}
                      gallery = {sliderGallery}
                      transitionInterval = {1}
                      id={'listingDetailsInfo'}
                      showInterval = {2}
                      slideInterval = {0.3}
                      overlayText = {true}
                      autoPlay = {false}
                      navigation = {true}
                      carouselNavigation = {true}
                      showIndex = {0}
                      isDisabled={false}
                      hasHeartIcon={true}
                      hasCheckBoxIcon={true}
                      lazyLoad = {false}
                      fullScreen={true}
                      showDot = {slideShowData.length >1 ? true : false}
                      resizeMode = {"cover"}
                      shareItem={this._shareHandler}>
                    </ImageSlider>
                )}
                
                

                  <TouchableOpacity style={{ position: 'absolute',  top: 30, left: 23 }} onPress={this._handleBackPress} activeOpacity={1}>
                        <Image
                            style={{ width: 40, height: 40 }}
                            source={require('../../assets/icons/back-arrow.png')}
                        />
                  </TouchableOpacity>
                  <View style={{ display: 'flex', flexDirection: 'row', width: 82, opacity: 1, position:'absolute',  right: 30, top: 36 }}>
                   
                   {this.state.isShortListed ?
                    (
                        <TouchableOpacity 
                        onPress={() => this.removeShortList()}>
                        <Image 
                            style={{width: 28, height: 28 , marginRight: 15 }}
                            source={require('../../assets/icons/heart-booked.png')}
                        />
                        </TouchableOpacity >
                    ):
                    (
                        <TouchableOpacity onPress={() => this.addToShortList()}>
                        <Image 
                            style={{width: 28, height: 28 , marginRight: 20 }}
                            source={require('../../assets/icons/bookmark_white_outline.png')}
                        />
                        </TouchableOpacity >
                    )}

                    <TouchableOpacity  onPress={MultiTapHandler(() => this._shareItem(), true ? 1000 : 0)} activeOpacity={1}>
                    <Image 
                            style={{width: 28, height: 28 }}
                            source={require('../../assets/icons/share-new.png')}
                        />
                    </TouchableOpacity>    
                   </View>     
                </View>
            );
        }
        return (
            <View style={{ flex: 1 }}>
                <NavigationHelper
                  ref={"navigationHelper"}
                  navigation={this.props.navigation}
                />
                <BookmarkHelper
                  ref={"bookmarkHelper"}
                  navigation = {this.props.navigation}
                />
                <ShareHelper
                    ref={"share"}
                    message={"This property might interest you"}
                  />
                {this.state.onPressBookmark && (
                    <View>
                      <WishList
                        isPropertyList={true}
                        accesskey={this.state.userInfo.accesskey} 
                        userId={this.state.userInfo.uid}
                        nid={this.state.bookmarkNid}
                        mid={this.state.bookmarkMid}
                        modalVisible={this.state.onBookmarkClick} 
                        closeModal={this.closeWishlistModal}
                        handleChange={this.handleChange}
                        listType={this.props.navigation.state.params.data.listing_type}
                        onRefresh={this.doNothing}
                      />
                    </View>
                )}
                <ScrollView contentContainerStyle={{
                    paddingBottom: 75
                }}>
                    {_renderSlideShow()}
                    <View style={{backgroundColor : '#f7f7f7'}}>
                        <ListingPriceInfo
                          title={this.state.listingInfo.title?this.state.listingInfo.title:''}
                          priceInfo={this.state.listingPriceInfo}
                          onPressMortgage={()=>{
                            if(this.refs.navigationHelper != undefined){
                              this.refs.navigationHelper._navigate('MortgageCalculator', {
                                  data: {
                                    asking_price_value: this.state.listingPriceInfo.askingPrice
                                  }
                                  // title: this.props.navigation.state.params.title
                              })
                            }
                          }}
                        />

                        <ListingInfo
                          listingInfo={this.state.listingInfo}
                        />
                    </View>
                    {/*<Listing_KeyDetails keydetails={this.state.listingKeyDetails} />*/}
                    <View style={styles.hpMainContainer}>
                        <ListingDescription item={this.state.listingDescription} features={this.state.listingFeatures} facilities={this.state.listingFacilities} inOutSpaceData={this.state.listingInOutSpace} />
                        {(this.navigation.state.params.data.lan>0 && this.navigation.state.params.data.lat>0) && (
                            <View display={(this.state.nearbyListing.length>0 && this.params.data.lan > 0 && this.params.data.lat > 0) ? 'flex' : 'none'} style={[{ height: Dimensions.get('window').height * 0.503, backgroundColor: '#FFF', paddingBottom: 15  }, styles.hpFirstSec ]}>
                                <Text allowFontScaling={false} style={{ color: '#414141',fontSize: width * 0.038, fontFamily: 'Poppins-SemiBold', paddingLeft: 15, marginBottom: 15, marginTop: 15 }}>Location</Text>
                                <ListingDetailLocation destinations={this.state.nearbyListing} navigation={this.props.navigation} showNearBy={true} calcFun={this.calculateHeight}/>
                            </View>
                        )}
                        {this.state.pastTransactionDetail && this.state.pastTransactionDetail.property && (this.state.pastTransactionDetail.totalpages > 0) && (
                        <View style={styles.hpFirstSec}>
                            <Past_TransactionDetail
                                transactionDetail = {this.state.pastTransactionDetail}
                                tagged = {this.tagged}
                            />
                        </View>
                        )}
                        {this.state.relatedListing.length > 0 && (
                             <View display={this.state.relatedListing && this.state.relatedListing.length>0 ? 'flex' : 'none'} style={[styles.hpFirstSec, { paddingLeft: 15, marginBottom: 0 }]}>
                                {/*<Text allowFontScaling={false} style={{ color: '#414141',fontSize: width * 0.055, fontFamily: 'Poppins-SemiBold', paddingLeft: 15,  }}>Similar Properties</Text>
                                <ListingResult_List
                                    navigation={this.props.navigation}
                                    headerTitle={'Related Listings'}
                                    relatedData={this.state.relatedListing}
                                    onPressItem={this._handleOnPressListing}
                                    isRelated={true}
                                />*/}
                                <Home_List
                                  item={this.state.relatedListing}
                                  title={'Similar Properties'}
                                  tooltip={false}
                                  moreOption={false}
                                  onPressItem={this._handleOnPressListing}
                                  isSimilar={true}
                                />
                            </View>   
                        )}
                    </View>
                   
                </ScrollView>
                {Object.keys(this.state.listingHighlight).length==0?(
                    <Loading/>
                ):<View/>}
            </View>
        )
    }
}
const { width, height } = Dimensions.get('window')
const styles= StyleSheet.create({
    hpMainContainer: {
        backgroundColor: '#E0E0E0'
    },
    hpFirstSec: {
        backgroundColor: '#fff',
        paddingBottom: 20,
        marginBottom: 10
    }
})
export default ListingDetailInfo
