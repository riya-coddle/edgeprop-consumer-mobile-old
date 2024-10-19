import React, { Component } from 'react'
import {
    View,
    ScrollView,
    PixelRatio,
    Dimensions,
    Text,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    AsyncStorage
} from 'react-native'
import firebase from 'react-native-firebase';
import { HeaderBackButton } from 'react-navigation'
import appsFlyer from 'react-native-appsflyer';
import BookmarkHelper from '../../components/Common_BookmarkHelper/Common_BookmarkHelper.js'
import SearchOption from '../../components/ListingResult_SearchOption/ListingResult_SearchOption'
import ListingResultList from '../../components/ListingResult_List/ListingResult_List'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import SortListingData from '../../assets/json/SortListingData.json'
import Boundary from '../../assets/json/Search_Data/Boundary.json'
import IconMenu from '../../components/Common_IconMenu/Common_IconMenu.js'
import HeaderSearch from '../../components/Common_HeaderSearch/Common_HeaderSearch'
import SaveSearch from '../../app/SavedSearchModal/SavedSearchModal';
import Loading from '../../components/Common_Loading/Common_Loading'
import { Dropdown } from 'react-native-material-dropdown';

const screenWidth = Dimensions.get('window').width;
//const HOSTNAME = "https://alice.edgeprop.my/property/v1/nsearch";
const HOSTNAME = "https://www.edgeprop.my/jwdsonic/api/v1/property/search";
const HOSTNAME_MAP = "https://alice.edgeprop.my/property/v1/get_map";
const PROXY_URL = "?";
const API_DOMAIN = "";
const API_GET_LISTING_RESULT = HOSTNAME + PROXY_URL;
const API_GET_MAP_LISTING_RESULT = HOSTNAME_MAP + PROXY_URL;
const TIMEOUT = 1000;
const PAGE_SIZE = 10;
const filter = [
  { label: 'Relevance' , value: 'relevance' },
  { label: 'Latest First' , value: 'posted_desc' },
  { label: 'Price Low to High' , value: 'price_asc' },
  { label: 'Price High to Low' , value: 'price_desc' }
];
class ListingResult extends Component {
    pageCount = 0;
    totalPage = 1;
    totalListing = -1;
    didMount = false
    orderBy = 'posted_desc'
    sortingValue = 'Latest First'

    static navigationOptions = ({ navigation }) => {
        var map_icon = require('../../assets/icons/Map.png');
        var filter_icon = require('../../assets/icons/Filter.png');
        const { state, setParams } = navigation;
        var { params } = state
        //console.log('params',params);
        let mapFlag = (params) =>{
            var flag = false;
            if(params.title == 'MRTSelectionNav'){
                flag = true;
            }else if(params.title == 'searchoption'){
                if(params.data.lat && params.data.lng){
                    flag = true;
                }
            }
            return flag;
        }

        //console.log('mapFlag',mapFlag(params));
        return {
          header: null,
          /*header:(
            <View style={{ padding: 10 }}>
              <View style={
                  {
                      flexDirection: 'row',
                      backgroundColor: "#FFF",
                      height: 75,
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    
                  }}> 

                  {navigation.goBack!=undefined?
                    <HeaderBackButton
                      tintColor={"#414141"}
                      onPress={() => {navigation.goBack()}}
                    />:<View/>
                  }
                  <Text
                    style={{
                        fontSize: 16,
                        fontFamily: 'Poppins-SemiBold',
                        color: '#414141',
                        textAlign: 'center',
                    }}>
                    {''}
                    </Text>
                    <View display={mapFlag(params) ? 'flex' : 'none'}>
                         <IconMenu
                            imageWidth={22}
                            imageHeight={22}
                            paddingVertical={10}
                            paddingHorizontal={0}
                            type={"icon"}
                            imageSource={map_icon}
                            onPress={() => params.handleMap()}
                        />
                    </View>
                    <TouchableOpacity onPress={() => params.handleFilter()} >
                        <Image
                            style={{ width: 20, height: 20, marginRight: 20 }} 
                            source={filter_icon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
          ) */
        };
    };

    constructor(props) {
        super(props);
        this.navigation = props.navigation

        this.state = {
            listingResult: {},
            bookmarkList: [],
            showModal: false,
            saveParams: '',
            noItem: false,
            area : '',
            sortBy: filter[0].value,
            flagState: 0,
            toggleLoader: false,
            userInfo: {},
            // Search data
        }
        
        this.listingResultURL = API_GET_LISTING_RESULT;
        this._callAPI = this._callAPI.bind(this);
        this.doNothing = this.doNothing.bind(this)
        this._handleOnPressListing = this._handleOnPressListing.bind(this);
        this._handleLoadMore = this._handleLoadMore.bind(this);
        this._handleData = this._handleData.bind(this)
        this._onSortPress = this._onSortPress.bind(this)
        this._handleFilter = this._handleFilter.bind(this);
        this._handleMap = this._handleMap.bind(this);
        this._handleParamSearchOption = this._handleParamSearchOption.bind(this);
        this._setParameterValue1 = this._setParameterValue1.bind(this)
        this._setParameterValue2 = this._setParameterValue2.bind(this)
        this._searchResultFeedback = this._searchResultFeedback.bind(this)
        this._handleFilterSearchOption = this._handleFilterSearchOption.bind(this)
        this._checkBookmark = this._checkBookmark.bind(this)
        this._handleAutoSearchOption = this._handleAutoSearchOption.bind(this)
        this._handleOnPressHeaderSearch = this._handleOnPressHeaderSearch.bind(this);
        this._handleSavedSearch = this._handleSavedSearch.bind(this)
        this.onCloseClick = this.onCloseClick.bind(this)
        this._handleNoData = this._handleNoData.bind(this)
        this._handleTypeChange = this._handleTypeChange.bind(this)
        this._onToggle = this._onToggle.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
        this.title = this.props.navigation.state.params.data.titleCheck
        this.tempMRT = ''  
        this.parameterFilter = {
            listing_type: this.props.navigation.state.params.data.listing_type || 'sale',
            property_type_legacy: this.props.navigation.state.params.data.property_type_legacy || [],
            property_type: this.props.navigation.state.params.data.property_type || {label: "All Types", key: 0, idList: Array(0)},
            state: this.props.navigation.state.params.data.state || 'Kuala Lumpur',
            district: this.props.navigation.state.params.data.district || [],
            bedroom_min: this.props.navigation.state.params.data.bedRoomSelected,
            asking_price_min: this.props.navigation.state.params.data.asking_price_min || {},
            asking_price_max: this.props.navigation.state.params.data.asking_price_max || {},
            build_up_min: this.props.navigation.state.params.data.floor_area_min || {},
            build_up_max: this.props.navigation.state.params.data.floor_area_max || {},
            land_area_min: this.props.navigation.state.params.data.land_area_min || {},
            land_area_max: this.props.navigation.state.params.data.land_area_max || {},
            tenure: this.props.navigation.state.params.data.tenure || [],
            bathroom: this.props.navigation.state.params.data.bathroom || {id: "", value: "Any", index: 0},
            furnishing: this.props.navigation.state.params.data.furnishedType|| [],
            completed: this.props.navigation.state.params.data.completed || [],
            level: this.props.navigation.state.params.data.level || [],
            completion_year_min: this.props.navigation.state.params.data.completion_year_min || {},
            completion_year_max: this.props.navigation.state.params.data.completion_year_max || {},
            rental_yield: this.props.navigation.state.params.data.rental_yield || {},
            high_rental_volume: this.props.navigation.state.params.data.high_rental_volume || {},
            high_sales_volume: this.props.navigation.state.params.data.high_sales_volume || {},
            deals: this.props.navigation.state.params.data.deals || {} ,
            nearby_amenities: this.props.navigation.state.params.data.nearby_amenities || [],
            amenities_distance: this.props.navigation.state.params.data.amenities_distance || {id: "500", value: "< 0.5km"},
            rental_type: this.props.navigation.state.params.data.rental_type || '',
            keyword_features: this.props.navigation.state.params.data.keyword_features || "",
            keyword: this.props.navigation.state.params.data.keyword || "",
            asset_id: this.props.navigation.state.params.data.asset_id || "",
            lat: this.props.navigation.state.params.data.lat || "",
            lng: this.props.navigation.state.params.data.lng || "",
            t: this.props.navigation.state.params.data.t || "",
            is_search: this.props.navigation.state.params.data.is_search,
            new_launch: this.props.navigation.state.params.data.new_launch || false,
            comyr: this.props.navigation.state.params.data.comyr || {},
        }

        this.navigation.setParams({
          handleFilter: this._handleFilter,
          handleMap: this._handleMap,
        })
    }

    onChangeText(text) {
        this.pageCount = 0;
        this.setState({
          sortBy: text,
          listingResult: {},
          toggleLoader: true,

      }, () => {
          this._onToggle();
      });
    }

    onCloseClick() {
      this.setState({ showModal: false })
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (JSON.stringify(nextState) != JSON.stringify(this.state))
    }

    _handleOnPressHeaderSearch() {
        // Alert.alert("Comming Soon", `Common HeaderSearch Touched, this feature will be coming soon`);
        this.refs.navigationHelper._navigateInMenu("PropertySearchMenu", {
         data: ''
       })
    }

    _handleSavedSearch() {
      this.setState({ showModal: true })
    }

    _handleTypeChange(type) {
        this.parameterFilter.listing_type = type
        this.pageCount = 0;
        this.setState({ flagState : 1, toggleLoader: true, listingResult: {} },()=>this._onToggle())
    }

    _onToggle() {
        this._changeURL()
        let param="";
        if (this.props.navigation.state.params.data.api_param != undefined) {
            this.parameterFilter.listing_type = this.props.navigation.state.params.data.listingType
            this.setState({ flagState : !this.state.flagState  })
           // console.log('hhghghg fdgf dfgdf', this.props.navigation.state.params.data.api_param)
            param = this.props.navigation.state.params.data.api_param;
        }
        this._callAPI(this.listingResultURL + param, "listingResult");
    }

    async componentDidMount() {
        this.pageCount = 0;
        this.didMount = true
        this.setState({ noItem :  false })
        this._checkBookmark();
        const auth = await AsyncStorage.getItem("authUser");
          if(auth && auth != '') {
            let authItems = JSON.parse(auth);
            console.log(authItems)
            if(authItems.status == 1) {
              this.setState({ userInfo: authItems })
            }  
          }
        //console.log('componentDidMount');
        if(this.props.navigation.state.params && this.props.navigation.state.params.isCheckBox) {
            this._handleData(this.props.navigation.state.params.data)
        }
        this._changeURL()
        let param="";
        if (this.props.navigation.state.params.data.api_param != undefined) {
            this.parameterFilter.listing_type = this.props.navigation.state.params.data.listingType
            this.parameterFilter.state = this.props.navigation.state.params.data.state
            this.setState({ flagState : !this.state.flagState  })
            console.log('this.parameterFilter ',this.props.navigation.state.params.data)
            param = this.props.navigation.state.params.data.api_param;
        }
        this._callAPI(this.listingResultURL + param, "listingResult");
    }

    componentWillUnmount() {
      this.didMount = false
    }

    _checkBookmark(){
      this.refs.bookmarkHelper._getBookmarks((nids)=>{
        if(nids!=undefined && Array.isArray(nids)){
          if(this.didMount && JSON.stringify(nids)!=JSON.stringify(this.state.bookmarkList.toString)){
            this.setState({
              bookmarkList: nids
            })
          }
        }
      });
    }

    doNothing() {
      console.log('ref');
    }

    _validateData(currentData, incomingData, latestSize) {
        // console.log(currentData);
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

    _handleFilter(){
     /// console.log('_handleFilter',this._getAllParameters());
      this.refs.navigationHelper._navigate('SearchOption', {
          data: this._getAllParameters(),
          title: this.props.navigation.state.params.data.titleCheck,
          searchResultFeedback: this._searchResultFeedback,
      })
    }
    _searchResultFeedback(title, data){
    //console.log('_searchResultFeedback',data);
            if(title !='' && data) {
                this.title = title;
                this.parameterFilter= {
                    listing_type: data.listing_type,
                    property_type_legacy: data.property_type_legacy,
                    property_type: data.property_type,
                    district: data.district,
                    state: data.state,
                    bedroom_min: data.bedRoomSelected,
                    asking_price_min: data.asking_price_min,
                    asking_price_max: data.asking_price_max,
                    build_up_min: data.floor_area_min,
                    build_up_max: data.floor_area_max,
                    land_area_min: data.land_area_min,
                    land_area_max: data.land_area_max,
                    tenure: data.tenure,
                    bathroom: data.bathroom,
                    furnishing: data.furnishedType,
                    completed: data.completed,
                    level: data.level,
                    completion_year_min: data.completion_year_min,
                    completion_year_max: data.completion_year_max,
                    rental_yield: data.rental_yield,
                    high_rental_volume: data.high_rental_volume,
                    high_sales_volume: data.high_sales_volume,
                    deals: data.deals,
                    nearby_amenities: data.nearby_amenities,
                    amenities_distance: data.amenities_distance,
                    rental_type: data.rental_type,
                    keyword_features: data.keyword_features,
                    keyword: data.keyword,
                    asset_id: data.asset_id,
                    lat: data.x,
                    lng: data.y,
                    t: data.t,
                    is_search: data.is_search,
                    new_launch: data.new_launch,
                    comyr: data.comyr,
                    chosenType: this.props.navigation.state.params.data.chosenType
                    //keyword: 
                }

                this.totalListing= -1;
                // this.state.listingResult = {}
                this.setState({
                    listingResult : {}
                })
                this._changeURL()
                this._callAPI(this.listingResultURL, "listingResult");
    
            }
        }
    _getAllParameters() {
       // console.log('search',this.parameterFilter);
        if(this.parameterFilter){
            return ({
            listing_type: this.parameterFilter.listing_type,
            property_type: this.parameterFilter.property_type,
            property_type_legacy: this.parameterFilter.property_type_legacy,
            district: this.parameterFilter.district,
            state: this.parameterFilter.state,
            bedroom_min: this.props.navigation.state.params.data.bedRoomSelected,
            asking_price_min: this.parameterFilter.asking_price_min,
            asking_price_max: this.parameterFilter.asking_price_max,
            build_up_min: this.parameterFilter.build_up_min,
            build_up_max: this.parameterFilter.build_up_max,
            land_area_min: this.parameterFilter.land_area_min,
            land_area_max: this.parameterFilter.land_area_max,
            tenure: this.parameterFilter.tenure,
            bathroom: this.parameterFilter.bathroom,
            furnishing: this.parameterFilter.furnishing,
            completed: this.parameterFilter.completed,
            level: this.parameterFilter.level,
            completion_year_min: this.parameterFilter.completion_year_min,
            completion_year_max: this.parameterFilter.completion_year_max,
            rental_yield: this.parameterFilter.rental_yield,
            high_rental_volume: this.parameterFilter.high_rental_volume,
            high_sales_volume: this.parameterFilter.high_sales_volume,
            deals: this.parameterFilter.deals,
            nearby_amenities: this.parameterFilter.nearby_amenities,
            amenities_distance: this.parameterFilter.amenities_distance,
            rental_type: this.parameterFilter.rental_type,
            keyword_features: this.parameterFilter.keyword_features,
            keyword: this.parameterFilter.keyword,
            asset_id: this.parameterFilter.asset_id,
            lat: this.parameterFilter.x,
            lng: this.parameterFilter.y,
            t: this.parameterFilter.t,
            is_search: this.parameterFilter.is_search,
            new_launch: this.parameterFilter.new_launch,
            comyr: this.parameterFilter.comyr,
            chosenType: this.props.navigation.state.params.data.chosenType
        })
        }
    }

    _handleMap(){
        //console.log('parameterFilter',this.parameterFilter);
        let tempFilter = this._handleParamSearchOption(this.parameterFilter,true)
        if(this.parameterFilter.t!='Districts' && (this.parameterFilter.t.length>0 || this.tempMRT.length>0) ){
            //console.log('region asset Metro')
            let map_params = '';
                map_params = this.tempMRT+'&m_type=1'
            let url = API_GET_MAP_LISTING_RESULT + API_DOMAIN + tempFilter + map_params

            //url = "https://www.edgeprop.sg/proxy?url=https%3A%2F%2Fwww.edgeprop.sg%2Findex.php%3Foption%3Dcom_analytica%26task%3Dmapsearch%26mode%3Dmap%26geo_type%3Dasset%26listing_type%3Dsale%26property_type%3D%26district%3D%26bedroom_min%3D%26asking_price_min%3D%26asking_price_max%3D%26floor_area_min%3D%26floor_area_max%3D%26land_area_min%3D%26land_area_max%3D%26tenure%3D%26bathroom%3D%26furnishing%3D%26completed%3D%26level%3D%26completion_year_min%3D%26completion_year_max%3D%26rental_yield%3D%26high_rental_volume%3D%26high_sales_volume%3D%26deals%3D%26nearby_amenities%3D%26amenities_distance%3D500%26rental_type%3D%26keyword_features%3D%26keyword%3D%26asset_id%3D%26resource_type%3D%26x%3D%26y%3D%26search_by%3Dmrt%26search_by_distance%3D1000%26search_by_location%3DCC2%2C29956.0981%2C31020.4566%2C1.296812442%2C103.850895%7CCC4%2C31038.7453%2C30451.1163%2C1.292930254%2C103.8611%7CCC7%2C33465.6401%2C32055.487%2C1.306172472%2C103.8824299%7CCC8%2C34153.9394%2C32294.848%2C1.308337038%2C103.8886147%7CCC9%2C34650.952%2C33376.855%2C1.317247385%2C103.8922608%7CCC6%2C32676.3477%2C31683.9408%2C1.302875527%2C103.8754276%7CCC5%2C31365.8669%2C31344.1067%2C1.299739299%2C103.8635624%26page%3D1%26pageSize%3D10%26order_by%3Dposted_desc";
            //console.log('url',url)
            this.refs.navigationHelper._navigate('CommonMap', {
                mapURL: url,//this.listingResultURL.replace(encodeURIComponent("mode=list"),encodeURIComponent("mode=map&geo_type=asset")),
                data: this.parameterFilter,
                title: this.tempMRT.length>0?'special asset':'asset',
                searchResultFeedback: this._searchResultFeedback,
                selectionFrom: this.title

            })
        }
        else if (this.parameterFilter.t=='Districts' || this.parameterFilter.t == 'HDB Towns' || this.parameterFilter.district.length>0){
            //console.log('region planning District ')
            let boundary = Boundary.filter(value => value.title == this.parameterFilter.state)
            let map_params = '';
            if(boundary.length >0){
                map_params = 'lat='+boundary[0].lat+'&lng='+boundary[0].lng+'&m_type=2'
            }
            let url = API_GET_MAP_LISTING_RESULT + API_DOMAIN + tempFilter + map_params

            //url = "https://www.edgeprop.sg/proxy?url=https%3A%2F%2Fwww.edgeprop.sg%2Findex.php%3Foption%3Dcom_analytica%26task%3Dmapsearch%26mode%3Dmap%26geo_type%3Ddistrict%26listing_type%3Dsale%26property_type%3D%26district%3D1024%2C1031%26bedroom_min%3D%26asking_price_min%3D%26asking_price_max%3D%26floor_area_min%3D%26floor_area_max%3D%26land_area_min%3D%26land_area_max%3D%26tenure%3D%26bathroom%3D%26furnishing%3D%26completed%3D%26level%3D%26completion_year_min%3D%26completion_year_max%3D%26rental_yield%3D%26high_rental_volume%3D%26high_sales_volume%3D%26deals%3D%26nearby_amenities%3D%26amenities_distance%3D500%26rental_type%3D%26keyword_features%3D%26keyword%3D%26asset_id%3D%26resource_type%3D%26x%3D%26y%3D%26search_by%3D%26search_by_distance%3D500%26search_by_location%3D%26page%3D1%26pageSize%3D10%26order_by%3Dposted_desc";
            //console.log('url',url)
            this.refs.navigationHelper._navigate('CommonMap', {
                mapURL: url,//this.listingResultURL.replace(encodeURIComponent("mode=list"),encodeURIComponent("mode=map&geo_type=district")),
                data: this.parameterFilter,
                title: 'district',
                searchResultFeedback: this._searchResultFeedback,
                selectionFrom: this.title
            })
        }
        else{
            //console.log('other')
            let map_params = '';
            /*if(boundary.length >0){
                map_params = 'lat='+boundary[0].lat+'&lng='+boundary[0].lng+'&m_type=2'
            }*/
            let url = API_GET_MAP_LISTING_RESULT + API_DOMAIN + tempFilter + map_params

            /*url = "https://www.edgeprop.sg/proxy?url=https%3A%2F%2Fwww.edgeprop.sg%2Findex.php%3Foption%3Dcom_analytica%26task%3Dmapsearch%26mode%3Dmap%26geo_type%3Dregion%26listing_type%3Dsale%26property_type%3D%26district%3D%26bedroom_min%3D%26asking_price_min%3D%26asking_price_max%3D%26floor_area_min%3D%26floor_area_max%3D%26land_area_min%3D%26land_area_max%3D%26tenure%3D%26bathroom%3D%26furnishing%3D%26completed%3D%26level%3D%26completion_year_min%3D%26completion_year_max%3D%26rental_yield%3D%26high_rental_volume%3D%26high_sales_volume%3D%26deals%3D%26nearby_amenities%3D%26amenities_distance%3D500%26rental_type%3D%26keyword_features%3D%26keyword%3D%26asset_id%3D%26resource_type%3D%26x%3D%26y%3D%26radius%3D1000%26search_by%3D%26search_by_distance%3D%26search_by_location%3D%26search_by_showmap%3Dtrue%26below_valuation%3D%26map_zoom%3D%26asset_lat%3D%26asset_lng%3D%26page%3D1%26pageSize%3D10%26order_by%3Dposted_desc";*/
            //console.log('url',url)
            this.refs.navigationHelper._navigate('CommonMap', {
                mapURL: url,//this.listingResultURL.replace(encodeURIComponent("mode=list"),encodeURIComponent("mode=map&geo_type=region")),
                data: this.parameterFilter,
                title: 'region',
                searchResultFeedback: this._searchResultFeedback,
                selectionFrom: this.title
            })
        }

    }
    
    _handleAutoSearchOption(data) {
        console.log(data);
        let temp = ''
        if(data) {
            let paramSearch = {
                state: data.state?data.state:"Kuala Lumpur",
                start:0,
                size:200,
                district:data.district,
                keyword: data.keyword,
                asset_id: data.asset_id,
                poi_lat: data.lat,
                poi_lon: data.lng,
            }
            Object.keys(paramSearch).map((item, index)=>{
                if(paramSearch[item]){
                        temp+=(item+'='+paramSearch[item]+'&')
                }
            })

            return temp;    
        }
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
      }
    }

    _handleFilterSearchOption(data) {
       // console.log('data',data);
        var temp = ''
        let type = data.listing_type.value?data.listing_type.value.toLowerCase():(data.listing_type?data.listing_type:'')
        if(data) {
            let paramSearch = {
                /*state: data.state?data.state:"Kuala Lumpur",
                listing_type: data.listing_type?data.listing_type:'sale',
                start:0,
                size: 20,
                property_type: data.rental_type?data.rental_type:'rl',
                asking_price_max: data.asking_price_max,
                asking_price_min: data.asking_price_min,
                beds: data.bedroom_min,
                build_up_min: data.build_up_min,
                build_up_max: data.build_up_max,
                land_area_min: data.land_area_min,
                land_area_max: data.land_area_max,
                furnished: data.furnishing?data.furnishing: 'fully',
                featured: 1*/ 
                state: data.state ? encodeURIComponent(data.state) : encodeURIComponent("Kuala Lumpur"),
                listing_type: type == 'new_launch'?'sale':type,
                start:0,
                size:200,
                property_type: data.rental_type?data.rental_type:'rl',
                asking_price_max: this.isObejctCheck(data.asking_price_max,type,'asking_price_max'),
                asking_price_min: this.isObejctCheck(data.asking_price_min,type,'asking_price_min'),
                beds:data.bedroom_min?data.bedroom_min:0,
                build_up_min: this.isObejctCheck(data.build_up_min,type,'build_up_min'),
                build_up_max: this.isObejctCheck(data.build_up_max,type,'build_up_max'),
                land_area_min: this.isObejctCheck(data.land_area_min,type,'land_area_min'),
                land_area_max: this.isObejctCheck(data.land_area_max,type,'land_area_max'),
                furnished: data.furnishing?data.furnishing:'',
                featured:this.props.navigation.state.params.data.new_launch?0:1,
                new_launch: type == 'new_launch'?1:0, 
                keyword: this.props.navigation.state.params.data?(this.props.navigation.state.params.data[0]?this.props.navigation.state.params.data[0].value:''):'',
                asset_id: data.asset_id?data.asset_id:'',
                poi_lat: data.lat?data.lat:'',
                poi_lon: data.lng?data.lng:'',
                //district: data.district ? encodeURIComponent(data.district) : '', 
                keyword: data.keyword ? encodeURIComponent(data.keyword) :''
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
            listing_type: this._setParameterValue1(data.listing_type),
            start: this.pageCount,
            property_type: this._setParameterValue2(data.property_type.idList),
            state: flag? encodeURIComponent(data.state): '',
            mainPropertyType: this._setParameterValue3(data.property_type.idList,0),
            subPropertyType: this._setParameterValue3(data.property_type.idList,1),
            district: this._setParameterValue5(data.district),
            bedroom_min: this._setParameterValue1(data.bedroom_min),
            asking_price_min: this._setParameterValue1(data.asking_price_min),
            asking_price_max: this._setParameterValue1(data.asking_price_max),
            build_up_min: this._setParameterValue1(data.build_up_min),
            build_up_max: this._setParameterValue1(data.build_up_max),
            land_area_min: this._setParameterValue1(data.land_area_min),
            land_area_max: this._setParameterValue1(data.land_area_max),
            bathroom_min: this._setParameterValue1(data.bathroom),
            furnished: this._setParameterValue1(data.furnishing),
            new_launch: this._setParameterValue4(data.new_launch),
            comyr: this._setParameterValue1(data.comyr),
            keyword: encodeURIComponent(data.keyword),
            asset_id:data.asset_id,
            lat:data.lat,
            lng:data.lng,
        }
        if(data.is_search)
        paramSearch['is_search'] = data.is_search

        Object.keys(paramSearch).map((item, index)=>{
            if(paramSearch[item]){
                    temp+=(item+'='+paramSearch[item]+'&')
            }
        })
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

    _callAPI(apiUrl, stateName) {
        console.log('apiUrl',apiUrl);
        console.log('name', stateName)
        if (!this.state[stateName].results) {
            fetch(apiUrl,
                {
                    method: 'GET', timeout: TIMEOUT
                }).
                then((response) => response.json()).
                then((responseJson) => {
                    //console.log('responseJson',responseJson)
                    if (responseJson) {
                        if (this.totalListing != responseJson.found) {
                            this.totalListing = responseJson.found
                        }
                        //if (this.totalPage < Math.ceil(this.totalListing / PAGE_SIZE)) {
                          this.totalPage = Math.floor(this.totalListing / PAGE_SIZE)
                          console.log('PAGE_SIZE',PAGE_SIZE)
                        // }

                        if (this.didMount) {
                            if (this.state[stateName].length > 0) {
                            //console.log('stateName exist',stateName);
                                let res = responseJson.property? responseJson.property : [];
                                this.setState({
                                    [stateName]: [...this.state[stateName], ...this._validateData(this.state[stateName], res , 2 * this.PAGE_SIZE)],
                                },() => this._handleNoData(stateName));
                            }
                            else {
                                this.setState({
                                    [stateName]: responseJson.property ? responseJson.property : [],
                                },() => this._handleNoData(stateName));
                            }
                        }
                    }
                    console.log('this.totalListing',this.totalListing);
                    console.log('this.totalPage',this.totalPage);
                    console.log('this.pageCount',this.pageCount);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    _handleNoData(stateName) {
        if(stateName == 'listingResult' && Object.keys(this.state.listingResult).length > 0) {
            this.setState({ noItem : false , toggleLoader : false })
        }
        if(stateName == 'listingResult' && Object.keys(this.state.listingResult).length == 0) {
            this.setState({ noItem : true , toggleLoader : false })
        }
    }

    _handleOnPressListing(item, index) {
        console.log('it',item)
        firebase.analytics().logEvent('View_Listing', { id: item.listing_id });
        const eventName = "View_Listing";
        const eventValues = {
        };
        //console.log('_handleOnPressListing',item);
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
            },
            onGoBack: this.doNothing
        }) 
        /*
        this.refs.navigationHelper._navigate('ListingDetailNav', {
            data: {
                property_id: item.nid,
                listing_type:item.listing_type,
                key: (item.nid && item.nid >0)? 'n': 'm',
                uid: item.uid,
                nid: item.nid,
                lat: item.asking_price = item.field_prop_asking_price? (item.field_prop_asking_price.und? (item.field_prop_asking_price.und[0]? item.field_prop_asking_price.und[0].lat: 0): 0) : 0,
                lan: item.asking_price = item.field_prop_asking_price? (item.field_prop_asking_price.und? (item.field_prop_asking_price.und[0]? item.field_prop_asking_price.und[0].lng: 0): 0) : 0,
            }
        })*/
    }
    _handleLoadMore() {
        console.log('_handleLoadMore');
        this.pageCount++;
        console.log(this.pageCount, this.totalPage)
        if (this.pageCount <= this.totalPage) {
            //console.log('pageCount',this.pageCount);
            //console.log('totalPage',this.totalPage);
          //  console.log('_handleLoadMore true');
            this._changeURL()
            this._callAPI(this.listingResultURL, "listingResult");
        }
    }

    _changeURL() {
        this.title = this.title?this.title:this.props.navigation.state.params.title
        if(this.title == undefined) {
            this.title = 'searchoption'
        }
       // console.log('sdf', this.title)
        var dataSelection = this.props.navigation.state.params.data;
        // this.assetId = dataSelection.assetId
        // this.coordinateX = dataSelection.coordinateX
        // this.coordinateY = dataSelection.coordinateY
        // this.resourceType = dataSelection.resourceType
        // assetIdParam = this.assetId ? `asset_id=${this.assetId}` : 'asset_id='
        // coordinateXParam = this.coordinateX ? `x=${this.coordinateX}`: 'x='
        // coordinateYParam = this.coordinateY ? `y=${this.coordinateY}`: 'y='
        // resourceTypeParam = this.resourceType ? `resource_type=${this.resourceType}`: 'resource_type='
        //console.log('title',this.title);
        if(this.title=='HDB TOWNS'){
            //console.log('HDB TOWNS');
            // this.parameterFilter.district= this.props.navigation.state.params.data
            // this.parameterFilter.property_type= { label: 'HDB', key: 2, idList: ['14', '15', '16', '17', '18', '19', '20'] }
            var tempFilter = this._handleParamSearchOption(this.parameterFilter,true)
            // var tempHDB = ''
            // for(i=0 ; i < dataSelection.length; i++){
            //     i != dataSelection.length-1
            //      ?
            //         tempHDB += dataSelection[i].id + ','
            //      :
            //         tempHDB += dataSelection[i].id
            // }
            // this.listingResultURL = API_GET_LISTING_RESULT + encodeURIComponent(API_DOMAIN + "/index.php?option=com_analytica&task=mapsearch&mode=list&listing_type=sale&property_type=14%2C15%2C16%2C17%2C18%2C19%2C20&district="+tempHDB+"&bedroom_min=&asking_price_min=&asking_price_max=&floor_area_min=&floor_area_max=&land_area_min=&land_area_max=&tenure=&bathroom=&furnishing=&completed=&level=&completion_year_min=&completion_year_max=&rental_yield=&high_rental_volume=&high_sales_volume=&deals=&nearby_amenities=&amenities_distance=500&rental_type=&keyword_features=&keyword=&asset_id=&resource_type=&x=&y=&radius=500&search_by=&search_by_distance=&search_by_location=&search_by_showmap=true&below_valuation=&map_zoom=&asset_lat=&asset_lng=&page="+this.pageCount+"&pageSize="+ PAGE_SIZE+"&order_by="+this.orderBy+"");

            /***
                commented by Monish
            ****/
            //this.listingResultURL = API_GET_LISTING_RESULT + encodeURIComponent(API_DOMAIN + "/index.php?option=com_analytica&task=mapsearch&mode=list&"+tempFilter+"search_by=&search_by_distance=500&search_by_location=&page="+this.pageCount+"&pageSize="+ PAGE_SIZE+"&order_by="+this.orderBy+"");
            this.listingResultURL = API_GET_LISTING_RESULT + API_DOMAIN + "app=1&listing_type=sale&start="+this.pageCount+"&size="+ PAGE_SIZE;
        }
        else if(this.title=='DISTRICTS'){
            var tempFilter = this._handleParamSearchOption(this.parameterFilter,true)

            /***
                commented by Monish
            ****/
            this.listingResultURL = API_GET_LISTING_RESULT + API_DOMAIN + "app=1&" + tempFilter+(this.pageCount > 0 ? "start="+this.pageCount+"&" : "")+"size="+ PAGE_SIZE+"&order_by="+this.orderBy+"";
            //console.log('district before',this.listingResultURL);
            //this.listingResultURL = API_GET_LISTING_RESULT + encodeURIComponent(API_DOMAIN + "app=1&listing_type=sale&page="+this.pageCount+"&pageSize="+ PAGE_SIZE);
        }
        else if(this.title=='area'){
            let items = [];
            this.parameterFilter.state = this.props.navigation.state.params.state
            //var tempFilter = this._handleParamSearchOption(this.props.navigation.state.params,true)
            this.parameterFilter.keyword = this.props.navigation.state.params.data[0].value
            let type = this.parameterFilter.listing_type == 'new_launch'?'sale':this.parameterFilter.listing_type
            let new_launch = this.parameterFilter.listing_type == 'new_launch'? 1: 0
            var tempFilter = 'state='+encodeURIComponent(this.props.navigation.state.params.state)+'&keyword='+encodeURIComponent(this.props.navigation.state.params.data[0].value)+'&listing_type='+type+'&new_launch='+new_launch+'&order_by='+this.state.sortBy+"&property_type=rl"
            /***
                commented by Monish
            ****/

            this.setState({ saveParams: tempFilter })
            this.listingResultURL = API_GET_LISTING_RESULT + API_DOMAIN + "app=1&" + tempFilter +(this.pageCount > 0 ? "&start="+this.pageCount+"&" : "")+"&size="+ PAGE_SIZE+"&uid="+this.state.userInfo.uid+"&cache=0";
            //console.log(' before',this.listingResultURL);
            //this.listingResultURL = API_GET_LISTING_RESULT + encodeURIComponent(API_DOMAIN + "app=1&listing_type=sale&page="+this.pageCount+"&pageSize="+ PAGE_SIZE);
        }
        else if(this.title=='MRTSelectionNav'){
            //console.log('MRTSelectionNav');
            //console.log('parameterFilter',this.parameterFilter)
            var tempFilter = this._handleParamSearchOption(this.parameterFilter,false)
            var tempMRT = '';
            var tempMRTlat = 'lat=';
            var tempMRTlng = '&lng=';

            for(i=0 ; i < dataSelection.length; i++){
                var comma = '';
                i != dataSelection.length-1
                 ?
                    comma = ','
                :
                    comma = ''

                tempMRTlat += dataSelection[i].lat + comma
                tempMRTlng += dataSelection[i].lon + comma
            }
            if(dataSelection.length > 0){
                tempMRT = tempMRTlat+tempMRTlng;
            }
            this.tempMRT = tempMRT
             //console.log(tempMRT)

            /***
                commented by Monish
            ****/
            this.listingResultURL = API_GET_LISTING_RESULT + API_DOMAIN +"app=1&" +tempFilter+tempMRT+(this.pageCount > 0 ? "&start="+this.pageCount : "")+"&size="+ PAGE_SIZE+"&order_by="+this.orderBy+"&m_type=1";
             //console.log('url mrt', this.listingResultURL)
        }

        else if(this.title=='SchoolOption'){
            //console.log('SchoolOption');
            var tempFilter = this._handleParamSearchOption(this.parameterFilter,true)
            var tempSchool = ''

            for(i=0 ; i < dataSelection.length; i++){
                i != dataSelection.length-1
                 ?
                    tempSchool += ',' + dataSelection[i].x + ',' + dataSelection[i].y + ',' + dataSelection[i].lat + ',' + dataSelection[i].lon + '|'
                 :
                    tempSchool += ',' + dataSelection[i].x + ',' + dataSelection[i].y + ',' + dataSelection[i].lat + ',' + dataSelection[i].lon
            }
            /***
                commented by Monish
            ****/
            //this.listingResultURL = API_GET_LISTING_RESULT + encodeURIComponent(API_DOMAIN + "/index.php?option=com_analytica&task=mapsearch&mode=list&"+tempFilter+"search_by=school&search_by_distance="+this.props.navigation.state.params.distance+"&search_by_location="+tempSchool+"&page="+this.pageCount+"&pageSize="+ PAGE_SIZE+"&order_by="+this.orderBy+"");
            this.listingResultURL = API_GET_LISTING_RESULT + API_DOMAIN + "app=1&listing_type=sale&"+(this.pageCount > 0 ? "start="+this.pageCount+"&" : "")+"size="+ PAGE_SIZE;
        }

        else if(this.title=='searchoption' || this.title== 'CommonMap' || this.title == 'autoSearch'){
          // console.log(this.title);
            if(this.title == 'searchoption') {
             //   console.log('searchoptions',this._handleFilterSearchOption(this.parameterFilter)); 
                this.setState({ saveParams: this._handleFilterSearchOption(this.parameterFilter) })
               // console.log('api', API_GET_LISTING_RESULT + API_DOMAIN +"app=1&" + this._handleFilterSearchOption(this.parameterFilter)+(this.pageCount > 0 ? "start="+this.pageCount+"&" : "")+"size="+ PAGE_SIZE+"&order_by="+this.orderBy+"");
                this.listingResultURL = API_GET_LISTING_RESULT + API_DOMAIN +"app=1&" + this._handleFilterSearchOption(this.parameterFilter)+(this.pageCount > 0 ? "&start="+this.pageCount+"&" : "")+"size="+ PAGE_SIZE+"&order_by="+this.state.sortBy+"&uid="+this.state.userInfo.uid+"&cache=0"; 
            } 
              else {
               // console.log('searchoptions',this._handleParamSearchOption(this.parameterFilter));
              //  this.listingResultURL = API_GET_LISTING_RESULT + API_DOMAIN +"app=1&" + this._handleParamSearchOption(this.parameterFilter,true)+(this.pageCount > 0 ? "start="+this.pageCount+"&" : "")+"size="+ PAGE_SIZE+"&order_by="+this.orderBy+"";
                //console.log('filter',this.listingResultURL);
                //this.listingResultURL = API_GET_LISTING_RESULT + encodeURIComponent(API_DOMAIN + "app=1&listing_type=sale&page="+this.pageCount+"&pageSize="+ PAGE_SIZE);  
            }
            
        }

    }
    _handleData(data) {
       

        if(data) {
            this.setState({ area : data[0].value })
        }
        if(data.id != this.orderBy){
            this.setState({
                listingResult: {},
            });
            this.orderBy = data.id
            this.sortingValue = data.value
            this.totalListing= -1;
            //console.log('_handleData');
            this._changeURL()
            this._callAPI(this.listingResultURL, "listingResult");
        }
        this._changeURL()
        // this._callAPI(this.listingResultURL, "listingResult");
    }
    _onSortPress() {
        this.refs.navigationHelper._navigateInMenu('CommonSelection', {
            title: 'Order By',
            data: SortListingData,
            handlerData: this._handleData,
            checkBox: false,
        })
    }
    _formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
      }

    render() {
       // console.log('props values', this.props)

        return (
            <View style={{ display: 'flex', flex: 1 }}>
          <NavigationHelper
                    ref={"navigationHelper"}
                    navigation={this.props.navigation} />

            <View style={{ padding: 23 }} >
                 <HeaderSearch 
                    style={{position:'relative'}}
                    ref={'headerSearch'}
                    hintText={'Start a search'}
                    editable={true}
                    fontSize={15}
                    onIconPress={this._handleFilter}
                    showIconSearch={true}
                    isHomePage={false}
                    needsEdit={false}
                    onPress={this._handleOnPressHeaderSearch}
                    isProperty={true}
                    onSavedSeachPress={this._handleSavedSearch}
                  />
            </View>
            
            {this.state.showModal && (
                <SaveSearch 
                  closeModal={this.onCloseClick}
                  saveParams={this.state.saveParams}
                  type={this.parameterFilter.listing_type}
                />
            )}
            <BookmarkHelper
              ref={"bookmarkHelper"}
              navigation = {this.props.navigation}
            />
            <View style={styles.headerText}>
               <TouchableOpacity onPress={()=> this._handleTypeChange('sale')}>
                 <Text allowFontScaling={false} style={[this.parameterFilter.listing_type == 'sale'?styles.headerTextChildActive:styles.headerTextChild]}>
                    <Text allowFontScaling={false}>Buy</Text>
                 </Text>
                </TouchableOpacity> 
               <TouchableOpacity onPress={()=> this._handleTypeChange('rental')}>
                 <Text allowFontScaling={false} style={[this.parameterFilter.listing_type == 'rental'?styles.headerTextChildActive:styles.headerTextChild]}>
                    <Text allowFontScaling={false}>Rent</Text>
                 </Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={()=> this._handleTypeChange('new_launch')}>
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
             <View style={{ flexDirection: 'row', paddingLeft: 23, justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                <View style={{ marginRight: 10, marginTop: -10 }}>
                  <Text allowFontScaling={false} style={styles.sortText}>Sort By:</Text>
                </View>
                <View style={{ minWidth: 165, flex: 1, paddingLeft: 5, marginTop: 15}}>
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
                    labelHeight={0}
                  />
                </View>
                <View style={{ width:'30%' }}/>
              </View>
                {/* <StatusBarBackground lightContent={true} style={{backgroundColor:'#275075'}}/> */}
                <SearchOption
                    onPress={this._onSortPress}
                    sortingValue={this.sortingValue}
                />
                <View display={this.totalListing<0 ? 'flex' : 'none'}>
                    <ActivityIndicator animating size='large' />
                </View>
                {this.totalListing > 0 && (
                    <View  style={{ flex: 1, paddingLeft: 23 , paddingRight: 23, paddingTop: 5 }}>
                        <ListingResultList
                            bookmarkList={this.state.bookmarkList}
                            navigation={this.props.navigation}
                            items={this.state.listingResult}
                            onPressItem={this._handleOnPressListing}
                            totalListing = {this._formatNumber(this.totalListing)}
                            onLoadMore={this._handleLoadMore}
                            isEndOfData={this.pageCount >= this.totalPage}
                            onUpdateBookmark={this._checkBookmark}
                            newLaunch={this.parameterFilter.new_launch}
                            searchResult={true}
                            noTabs={true}
                        />
                    </View>
                )}
                {this.state.toggleLoader && (
                    <Loading/>
                  )}
                {this.state.noItem &&(
                    <View style={{
                        flex: 1, 
                        alignItems: 'center',
                        justifyContent: 'center', 
                    }}>
                    <Text allowFontScaling={false} style={{ fontFamily: 'Poppins-SemiBold', fontSize: 23, color: '#414141' }}>
                       Sorry! No items found! 
                    </Text>
                    </View>

                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
  headerText:{
     flexDirection: 'row',
     paddingLeft: 23,
     marginTop: -15
  },
  headerTextChildActive:{
    color:'#488BF8',
    fontSize: 16,
    paddingRight: 24,
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: '#488BF8'
  },
  headerTextChild:{
    color:'#414141',
    paddingRight: 24,
    fontSize: 16
  },
  sortSection: {
    flexDirection: 'row',
    marginBottom: 18,
    width:'100%'
  },
  sortText: {
    fontSize: 16,
    color:'#414141'
  },
  sortDate: {
   fontSize: 14,
   color:'#488BF8',
   paddingLeft: 16,
  },
  screen: {
    flex: 1,  
  },
});

export default ListingResult
